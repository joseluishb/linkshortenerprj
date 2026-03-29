import { desc, eq } from "drizzle-orm";
import { db, linksTable, InsertLink, SelectLink } from "@/db";

export async function getLinksByUserId(userId: string): Promise<SelectLink[]> {
  return db
    .select()
    .from(linksTable)
    .where(eq(linksTable.userId, userId))
    .orderBy(desc(linksTable.updatedAt));
}

export async function createLink(
  data: Pick<InsertLink, "userId" | "url" | "shortCode">
): Promise<void> {
  await db.insert(linksTable).values(data);
}
