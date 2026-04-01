import { notFound } from "next/navigation";
import { getLinkByShortCode } from "@/data/links";

type Props = {
  params: Promise<{ shortCode: string }>;
};

export default async function InterstitialPage({ params }: Props) {
  const { shortCode } = await params;
  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="max-w-lg w-full rounded-lg border p-8 shadow-sm space-y-4">
        <h1 className="text-xl font-semibold">You are leaving this site</h1>
        <p className="text-sm text-muted-foreground break-all">
          You are about to be redirected to:
        </p>
        <p className="rounded bg-muted px-3 py-2 text-sm font-mono break-all">
          {link.url}
        </p>
        <p className="text-sm text-muted-foreground">
          We do not control the content of external sites. Only continue if you
          trust this destination.
        </p>
        <a
          href={link.url}
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue to site
        </a>
      </div>
    </main>
  );
}
