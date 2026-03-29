import { eq } from "drizzle-orm";
import { db, linksTable, SelectLink } from "@/db";

export async function getLinksByUserId(userId: string): Promise<SelectLink[]> {
  return db
    .select()
    .from(linksTable)
    .where(eq(linksTable.userId, userId))
    .orderBy(linksTable.createdAt);
}
