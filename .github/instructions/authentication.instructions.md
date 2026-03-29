---
description: Read this before implementing or modifying authentication in the project.
---

# Authentication Guidelines

All authentication in this app is handled exclusively by **Clerk**. No other auth method, custom session logic, JWT handling, or password logic may be used.

## Rules

- Use `@clerk/nextjs` helpers only — `auth()`, `currentUser()`, `clerkMiddleware`, `SignInButton`, `SignUpButton`, `UserButton`, etc.
- Never implement custom auth, sessions, or token logic.
- Never trust a `userId` from a request body — always source it from `auth()` on the server.

## Protected Routes

- `/dashboard` is a protected route. Unauthenticated users must not be able to access it.
- Use `clerkMiddleware` in `proxy.ts` to enforce this. Example:

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

## Homepage Redirect for Authenticated Users

- If a logged-in user visits `/`, redirect them to `/dashboard`.
- Implement this in the homepage Server Component using `auth()` and `redirect()`:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  // render landing page...
}
```

## Sign In / Sign Up — Modal Only

- Sign-in and sign-up must always open as a **modal**, never navigate to a dedicated page.
- Use `<SignInButton mode="modal">` and `<SignUpButton mode="modal">` for all trigger buttons.
- Do not create `/sign-in` or `/sign-up` route pages.

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";

<SignInButton mode="modal">
  <button>Sign in</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>Sign up</button>
</SignUpButton>
```

## Environment Variables

All Clerk keys must live in `.env.local` and be exported from `lib/env.ts`. Required keys:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```
