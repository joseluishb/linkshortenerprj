"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createLink } from "@/data/links";

const createLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  shortCode: z.string().min(1, "Short code is required").regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens and underscores are allowed"),
});

type ActionResult = { success: true } | { error: string };

export async function createLinkAction(
  input: z.infer<typeof createLinkSchema>
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await createLink({ ...parsed.data, userId });
  } catch {
    return { error: "Short code already taken. Please choose another." };
  }

  return { success: true };
}
