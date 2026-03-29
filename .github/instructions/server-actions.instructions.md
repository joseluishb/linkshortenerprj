---
description: Read this before implementing any data mutations (create, update, delete) in the project.
---

# Server Actions

All data mutations must be done via **Server Actions**. No API routes or client-side fetch calls may be used for mutations.

## Rules

- Server actions must be called from **Client Components** only.
- Server action files **must be named `actions.ts`** and colocated in the same directory as the component that calls them.
- **Never use the `FormData` TypeScript type** — all data passed to server actions must use explicit TypeScript types.
- All input data **must be validated with Zod** before any business logic or database operations.
- Every server action **must verify a logged-in user** (via `auth()` from Clerk) before proceeding. Never trust a `userId` from the caller.
- Database operations must be done via **helper functions in the `/data` directory**. Server actions must not import or call Drizzle queries directly.
- **Never throw errors** from server actions. Always return a typed object with either a `success` or `error` property.

## File Structure Example

```
app/dashboard/
  new-link-form.tsx       ← "use client" component
  actions.ts              ← server action colocated here
data/
  links.ts                ← Drizzle helper functions
```

## Example

```ts
// app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createLink } from "@/data/links";

const schema = z.object({
  url: z.string().url(),
  shortCode: z.string().min(1),
});

type ActionResult = { success: true } | { error: string };

export async function createLinkAction(input: z.infer<typeof schema>): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  await createLink({ ...parsed.data, userId });
  return { success: true };
}
```
