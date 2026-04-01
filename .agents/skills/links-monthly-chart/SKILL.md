---
name: links-monthly-chart
description: >
  Generates a bar chart PNG showing how many short links were created each month
  for the past 12 months. Reads DATABASE_URL from the project's .env.local (or
  .env) file, queries the `links` table, and produces a labelled bar chart saved
  as a PNG file. Use this skill whenever the user asks to visualise, chart, plot,
  or graph link creation trends, monthly link stats, or "how many links were
  created" over time. Also use it for any request like "show me a breakdown of
  links per month", "export link stats as an image", or "plot link creation
  history".
---

# links-monthly-chart

Produces a bar chart PNG of short-link creation counts, one bar per month, for
the trailing 12 months (including the current month).

## When to use

- User asks to "chart", "plot", "visualise", or "graph" link creation over time
- User wants to see monthly link stats or trends
- User asks for a PNG / image of link activity

## What you do

1. **Install dependencies** (if missing) — `psycopg2-binary`, `matplotlib`,
   `python-dateutil`.
2. **Run the bundled script** to query the DB and render the chart.
3. **Report the output path** so the user knows where the PNG was saved.

---

## Step-by-step

### 1. Check / install Python dependencies

Run the following and install anything that's missing:

```bash
python -c "import psycopg2, matplotlib, dateutil" 2>&1
```

If any import fails, install with:

```bash
pip install psycopg2-binary matplotlib python-dateutil
```

### 2. Determine the output path

Default: `links_monthly.png` in the **current working directory** (i.e., the
project root).  If the user specified a different path, use that instead.

### 3. Run the script

```bash
python .agents/skills/links-monthly-chart/scripts/chart_links.py \
  --output links_monthly.png
```

Optional flags:
- `--output <path>` — where to save the PNG (default `links_monthly.png`)
- `--env <path>` — path to the .env file if not at the project root

The script:
- Reads `DATABASE_URL` from `.env.local` or `.env` at the project root (or
  from the `DATABASE_URL` environment variable if already set).
- Queries the `links` table for rows where `created_at` falls within the past
  12 calendar months.
- Renders a bar chart with months on the x-axis and link count on the y-axis,
  annotates each bar with its count, and saves the result as a PNG at 150 dpi.

### 4. Report to the user

Tell the user the full path where the PNG was written, e.g.:

> Chart saved to: `/path/to/project/links_monthly.png`

If the file can be displayed inline (e.g., in a notebook or IDE preview), do so.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `DATABASE_URL not found` | Ensure `.env.local` or `.env` exists at the project root with a `DATABASE_URL=...` line |
| `psycopg2` import error | Run `pip install psycopg2-binary` |
| `matplotlib` import error | Run `pip install matplotlib` |
| `dateutil` import error | Run `pip install python-dateutil` |
| Empty chart (all zeros) | No links in the DB yet — the chart is still valid; all bars will be 0 |
| SSL / connection error | Check that `DATABASE_URL` includes `?sslmode=require` for Neon databases |
