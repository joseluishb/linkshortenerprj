# Link Shortener — Agent Instructions

This file is the single source of truth for LLM coding agents working in this repository.
All detailed standards are maintained in the `/docs` directory. Read the relevant doc(s)
before making changes to any area of the codebase.

For detailed guidelines on specific topics, refer to the modular documentation in the `/docs` directory. ALWAYS refer to the relevant .md file BEFORE generating any code.

## Docs Index

| Domain | File |
|---|---|
| Authentication (Clerk) | [`docs/auth.md`](docs/auth.md) |
| UI Components (shadcn/ui) | [`docs/ui.md`](docs/ui.md) |

## Project Overview

A full-stack link shortener application where authenticated users can create, manage, and
track shortened URLs. Unauthenticated visitors are redirected to the destination URL when
they visit a short link.

## Quick Rules

- **Always read the relevant doc** before modifying a domain (DB, auth, UI, etc.).
- **Never bypass TypeScript** — no `any`, no `@ts-ignore` without an explanatory comment.
- **Never commit secrets** — all environment variables go in `.env.local` and are typed in `env.ts`.
- **Server-first** — prefer React Server Components and Server Actions over client-side fetching.
- **Drizzle only** — do not write raw SQL strings; use the Drizzle query builder or `db.execute` with tagged templates for edge cases.
- **Clerk for all auth** — do not roll custom auth logic; use Clerk's helpers exclusively.
- **shadcn/ui for all UI primitives** — do not add new UI libraries.

## Agent Workflow

Follow these steps on every task:

1. **Identify the domain** (DB, auth, UI, routing, etc.).
2. **Read the relevant doc(s)** from the index above.
3. **Read the existing code** in the affected files before writing anything.
4. **Implement the minimal change** — do not refactor unrelated code.
5. **Verify TypeScript** compiles without errors (`tsc --noEmit`).
6. **Confirm no secrets** were hardcoded.

## Non-Negotiable Rules

### TypeScript

- Strict mode is on — no `any`, no `@ts-ignore` without an explanatory comment.
- All Server Action args and return types must be explicitly typed.

### Data & Security

- **Drizzle only** — no raw SQL strings; use the query builder or tagged-template `db.execute` for unsupported edge cases.
- **Always scope DB mutations to `userId`** sourced from `auth()` on the server — never trust a userId from the request body.
- **No secrets in code** — all env vars go in `.env.local` (git-ignored) and are exported from `lib/env.ts`.

### Architecture

- **Server-first** — default to React Server Components; add `"use client"` only when a component needs browser APIs, state, or event handlers.
- **Server Actions for mutations** — do not `POST` to API routes from client components when a Server Action will do.
- **Clerk for all auth** — do not implement custom sessions, JWTs, or password logic.
- **shadcn/ui for all UI primitives** — do not add new component libraries.

### Code Quality

- One component per file; components over ~150 lines should be split.
- No `console.log` in committed code.
- Do not add comments that only restate what the code does.
