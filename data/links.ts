import { and, desc, eq } from "drizzle-orm";
import { db, linksTable, InsertLink, SelectLink } from "@/db";

export async function getLinksByUserId(userId: string): Promise<SelectLink[]> {
  return db
    .select()
    .from(linksTable)
    .where(eq(linksTable.userId, userId))
    .orderBy(desc(linksTable.updatedAt));
}

export async function createLink(
  data: Pick<InsertLink, "userId" | "url" | "shortCode">,
): Promise<void> {
  await db.insert(linksTable).values(data);
}

export async function updateLink(
  id: number,
  userId: string,
  data: Pick<InsertLink, "url" | "shortCode">,
): Promise<void> {
  await db
    .update(linksTable)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(linksTable.id, id), eq(linksTable.userId, userId)));
}

export async function deleteLink(id: number, userId: string): Promise<void> {
  await db
    .delete(linksTable)
    .where(and(eq(linksTable.id, id), eq(linksTable.userId, userId)));
}

export async function getLinkByShortCode(
  shortCode: string,
): Promise<SelectLink | undefined> {
  const results = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.shortCode, shortCode))
    .limit(1);
  return results[0];
}
