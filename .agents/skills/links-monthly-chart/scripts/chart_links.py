#!/usr/bin/env python3
"""
Query the links table for the past 12 months and render a bar chart PNG.

Usage:
    python chart_links.py [--output <path>] [--env <path>]

Defaults:
    --output  links_monthly.png   (written to the current directory)
    --env     .env.local           (relative to cwd, then project root)
"""

import argparse
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_database_url(env_path: Path | None) -> str:
    """Read DATABASE_URL from a .env-style file or the process environment."""
    # 1. Already set in the environment
    if "DATABASE_URL" in os.environ:
        return os.environ["DATABASE_URL"]

    # 2. Try the supplied path, then common defaults
    candidates: list[Path] = []
    if env_path:
        candidates.append(env_path)
    cwd = Path.cwd()
    candidates += [
        cwd / ".env.local",
        cwd / ".env",
        Path(__file__).parent.parent.parent.parent / ".env.local",  # project root
        Path(__file__).parent.parent.parent.parent / ".env",
    ]

    for p in candidates:
        if p.is_file():
            for line in p.read_text().splitlines():
                line = line.strip()
                if line.startswith("#") or "=" not in line:
                    continue
                key, _, value = line.partition("=")
                if key.strip() == "DATABASE_URL":
                    return value.strip().strip('"').strip("'")

    raise EnvironmentError(
        "DATABASE_URL not found. Set it as an environment variable or place it in "
        ".env.local / .env at the project root."
    )


def query_monthly_counts(database_url: str) -> dict[str, int]:
    """
    Return a dict mapping 'YYYY-MM' strings to link counts for the past 12 months
    (including the current month).
    """
    try:
        import psycopg2  # type: ignore[import]
    except ImportError:
        sys.exit(
            "psycopg2 is required. Install it with:  pip install psycopg2-binary"
        )

    now = datetime.now(timezone.utc)
    # Build the 12-month window: from the start of (current month - 11 months)
    from dateutil.relativedelta import relativedelta  # type: ignore[import]

    window_start = (now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                    - relativedelta(months=11))

    conn = psycopg2.connect(database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM') AS month,
                    COUNT(*) AS total
                FROM links
                WHERE created_at >= %s
                GROUP BY month
                ORDER BY month;
                """,
                (window_start,),
            )
            rows = cur.fetchall()
    finally:
        conn.close()

    return {row[0]: int(row[1]) for row in rows}


def build_month_labels(n: int = 12) -> list[str]:
    """Return the last n months as 'YYYY-MM' strings, oldest first.

    Uses local time so the rightmost bar always matches the current calendar
    month visible to the user, regardless of UTC offset.
    """
    try:
        from dateutil.relativedelta import relativedelta  # type: ignore[import]
    except ImportError:
        sys.exit("python-dateutil is required. Install it with:  pip install python-dateutil")

    now = datetime.now()  # local time — keeps month labels human-friendly
    start = now.replace(day=1) - relativedelta(months=n - 1)
    labels = []
    for i in range(n):
        labels.append((start + relativedelta(months=i)).strftime("%Y-%m"))
    return labels


def plot_chart(counts: dict[str, int], output_path: Path) -> None:
    try:
        import matplotlib  # type: ignore[import]
        matplotlib.use("Agg")  # non-interactive backend — no display needed
        import matplotlib.pyplot as plt  # type: ignore[import]
        import matplotlib.ticker as mticker  # type: ignore[import]
    except ImportError:
        sys.exit("matplotlib is required. Install it with:  pip install matplotlib")

    labels = build_month_labels(12)
    values = [counts.get(lbl, 0) for lbl in labels]

    # Pretty display labels: "Jan\n2025"
    def fmt(ym: str) -> str:
        dt = datetime.strptime(ym, "%Y-%m")
        return dt.strftime("%b\n%Y")

    display_labels = [fmt(lbl) for lbl in labels]

    fig, ax = plt.subplots(figsize=(14, 6))
    bars = ax.bar(display_labels, values, color="#4f83cc", edgecolor="white", linewidth=0.6)

    # Annotate each bar with its count
    for bar, val in zip(bars, values):
        if val > 0:
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + max(values) * 0.01,
                str(val),
                ha="center",
                va="bottom",
                fontsize=9,
                color="#333333",
            )

    ax.set_title("Links Created — Past 12 Months", fontsize=15, fontweight="bold", pad=14)
    ax.set_xlabel("Month", fontsize=11, labelpad=8)
    ax.set_ylabel("Links Created", fontsize=11, labelpad=8)
    ax.yaxis.set_major_locator(mticker.MaxNLocator(integer=True))
    ax.set_ylim(0, max(values) * 1.15 if any(v > 0 for v in values) else 10)
    ax.spines[["top", "right"]].set_visible(False)
    ax.tick_params(axis="x", labelsize=8)

    fig.tight_layout()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output_path, dpi=150)
    print(f"Chart saved to: {output_path.resolve()}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Plot monthly link creation counts.")
    parser.add_argument("--output", default="links_monthly.png",
                        help="Output PNG file path (default: links_monthly.png)")
    parser.add_argument("--env", default=None,
                        help="Path to .env file containing DATABASE_URL")
    args = parser.parse_args()

    env_path = Path(args.env) if args.env else None
    output_path = Path(args.output)

    print("Loading DATABASE_URL...")
    database_url = load_database_url(env_path)

    print("Querying database...")
    counts = query_monthly_counts(database_url)

    print(f"Data retrieved: {counts}")
    print("Generating chart...")
    plot_chart(counts, output_path)


if __name__ == "__main__":
    main()
