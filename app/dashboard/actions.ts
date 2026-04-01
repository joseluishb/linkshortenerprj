"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createLink, countRecentLinksByUser, updateLink, deleteLink } from "@/data/links";

const safeUrl = z
  .string()
  .url("Please enter a valid URL")
  .refine(
    (val) => {
      try {
        const { protocol } = new URL(val);
        return protocol === "http:" || protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "URL must use http or https" },
  );

const createLinkSchema = z.object({
  url: safeUrl,
  shortCode: z
    .string()
    .min(1, "Short code is required")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, hyphens and underscores are allowed",
    ),
});

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  url: safeUrl,
  shortCode: z
    .string()
    .min(1, "Short code is required")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, hyphens and underscores are allowed",
    ),
});

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

type ActionResult = { success: true } | { error: string };

export async function createLinkAction(
  input: z.infer<typeof createLinkSchema>,
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await countRecentLinksByUser(userId, oneHourAgo);
  if (recentCount >= 10) {
    return { error: "Rate limit exceeded. You can create at most 10 links per hour." };
  }

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await createLink({ ...parsed.data, userId });
  } catch {
    return { error: "Short code already taken. Please choose another." };
  }

  return { success: true };
}

export async function updateLinkAction(
  input: z.infer<typeof updateLinkSchema>,
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await updateLink(parsed.data.id, userId, {
      url: parsed.data.url,
      shortCode: parsed.data.shortCode,
    });
  } catch {
    return { error: "Short code already taken. Please choose another." };
  }

  return { success: true };
}

export async function deleteLinkAction(
  input: z.infer<typeof deleteLinkSchema>,
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await deleteLink(parsed.data.id, userId);

  return { success: true };
}
