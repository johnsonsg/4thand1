# Routing and Pages (App Router)

This app uses the **Next.js App Router**. Routes are created by folders under `frontend/src/app` (optionally grouped under `(site)`).

## Key Rules

- A route folder must contain `page.tsx` to be visitable.
- `layout.tsx` provides layout wrappers.
- Files like `index.page.tsx` are **not** recognized by App Router.

## Route Groups

Folders wrapped in parentheses are **groups** that do not appear in the URL:

- `(site)` — public website routes and layout
- `(payload)` — Payload admin/API routes

## Dynamic Routes

Dynamic segments use brackets:

- `[slug]` → `/demo/alpha`, `/demo/boston`, etc.
- `[[...path]]` → optional catch‑all (handles `/`, `/about`, `/tickets/2026`, etc.)

Example demo route:

- [frontend/src/app/(site)/demo/[slug]/page.tsx](../frontend/src/app/(site)/demo/[slug]/page.tsx)

## Catch‑All Route

The CMS-driven public routing lives at:

- [frontend/src/app/(site)/[[...path]]/page.tsx](../frontend/src/app/(site)/[[...path]]/page.tsx)

This is where CMS pages are rendered dynamically.
