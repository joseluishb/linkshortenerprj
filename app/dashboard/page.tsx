import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { linksTable } from "@/db/schema";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const links = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.userId, userId))
    .orderBy(desc(linksTable.createdAt));

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <section className="flex flex-col gap-3 border-b pb-6">
          <p className="text-sm font-medium text-muted-foreground">
            Your dashboard
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight">Your links</h1>
              <p className="text-sm text-muted-foreground">
                {links.length} {links.length === 1 ? "link" : "links"} tied to your account.
              </p>
            </div>
          </div>
        </section>

        {links.length === 0 ? (
          <section className="rounded-xl border bg-muted/20 p-8">
            <h2 className="text-lg font-medium">No links yet</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Once you create a short link, it will show up here with its short code
              and destination URL.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            <ul className="space-y-3">
              {links.map((link) => (
                <li
                  key={link.id}
                  className="rounded-xl border bg-background p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded-full border px-2.5 py-1 font-medium text-foreground">
                          /{link.shortCode}
                        </span>
                        <span className="text-muted-foreground">
                          Created {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(link.createdAt)}
                        </span>
                      </div>
                      <p className="break-all text-sm text-muted-foreground">
                        {link.url}
                      </p>
                    </div>

                    <Button asChild variant="outline">
                      <a href={link.url} target="_blank" rel="noreferrer">
                        Visit destination
                      </a>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
