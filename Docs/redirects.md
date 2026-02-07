# Redirects

## Route‑level redirects

Create a `page.tsx` at the route folder and call `redirect()`:

- [frontend/src/app/(site)/demo/page.tsx](../frontend/src/app/(site)/demo/page.tsx)

This ensures `/demo` redirects to a default slug.

## Global redirect map (middleware)

Centralize index redirects in middleware:

- [frontend/middleware.ts](../frontend/middleware.ts)

Update the `indexRedirects` map to add more routes:

- `/demo` → `/demo/alpha`
- `/blog` → `/blog/latest`
