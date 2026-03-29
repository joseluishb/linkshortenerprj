import { auth } from "@clerk/nextjs/server";
import { getLinksByUserId } from "@/data/links";
import { SelectLink } from "@/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateLinkDialog } from "./create-link-dialog";

export default async function DashboardPage() {
  const { userId } = await auth();

  const links: SelectLink[] = userId ? await getLinksByUserId(userId) : [];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Links</h1>
        <CreateLinkDialog />
      </div>
      {links.length === 0 ? (
        <p className="text-muted-foreground">
          No links yet. Create one to get started.
        </p>
      ) : (
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold break-all">
                    {link.url}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Created{" "}
                    {new Date(link.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Short code:{" "}
                    <span className="font-mono font-semibold text-foreground">
                      {link.shortCode}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

