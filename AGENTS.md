# Link Shortener — Agent Instructions

This file is the single source of truth for LLM coding agents working in this repository.
All detailed standards are maintained in the `/docs` directory.

## Mandatory Requirement

Before generating ANY code, you MUST:

1. **READ the relevant documentation files** in the `/docs` directory for the domain you are working in (auth, UI, etc.). The table below will guide you to the correct file(s).

2. **FOLLOW the patterns and guidelines** in those files to the letter. Do not deviate, do not make assumptions, do not rely on memory. Always read the docs first.

3. **DO NOT proceed** to write or generate code until you have read and understood the relevant documentation. Skipping this step is a failure mode and will lead to incorrect implementations.

> **CRITICAL — NON-NEGOTIABLE:** You MUST read the relevant `/docs` file(s) BEFORE writing or generating ANY code, making ANY edits, or proposing ANY changes. No exceptions. Skipping this step is a failure mode. If you are unsure which doc applies, read all of them.

## Docs Index

**You MUST open and read the relevant file from this table before generating any code for the corresponding domain. Do not rely on memory or assumptions — always read the file.**

| Domain                    | File                           |
| ------------------------- | ------------------------------ |
| Authentication (Clerk)    | [`docs/auth.md`](docs/auth.md) |
| UI Components (shadcn/ui) | [`docs/ui.md`](docs/ui.md)     |

## Project Overview

A full-stack link shortener application where authenticated users can create, manage, and
track shortened URLs. Unauthenticated visitors are redirected to the destination URL when
they visit a short link.

## Quick Rules

- **ALWAYS read the relevant `/docs` file FIRST** — before modifying, creating, or generating any code for a domain (DB, auth, UI, etc.). This is the most important rule.
- **Never bypass TypeScript** — no `any`, no `@ts-ignore` without an explanatory comment.
- **Never commit secrets** — all environment variables go in `.env.local` and are typed in `env.ts`.
- **Server-first** — prefer React Server Components and Server Actions over client-side fetching.
- **Drizzle only** — do not write raw SQL strings; use the Drizzle query builder or `db.execute` with tagged templates for edge cases.
- **Clerk for all auth** — do not roll custom auth logic; use Clerk's helpers exclusively.
- **shadcn/ui for all UI primitives** — do not add new UI libraries.

## Agent Workflow

Follow these steps on every task — **every step is mandatory, no skipping**:

1. **Identify the domain** (DB, auth, UI, routing, etc.).
2. **STOP — Read the relevant `/docs` file(s)** from the index above. You MUST do this before proceeding. Do not write a single line of code until you have read the file and understood its constraints.
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
