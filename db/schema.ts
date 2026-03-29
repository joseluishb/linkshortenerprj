import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const linksTable = pgTable("links", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull(),
  url: text("url").notNull(),
  shortCode: text("short_code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type InsertLink = typeof linksTable.$inferInsert;
export type SelectLink = typeof linksTable.$inferSelect;
