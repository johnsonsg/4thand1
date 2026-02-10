# Copilot Instructions

## Big-picture architecture
- Monorepo root uses npm workspaces; the app lives in frontend with root scripts delegating to workspace (see [package.json](package.json) and [frontend/package.json](frontend/package.json)).
- Next.js App Router structure under frontend/src/app with route groups: (site) for public site and (payload) for Payload admin/API (see [Docs/routing-and-pages.md](Docs/routing-and-pages.md)).
- CMS-driven rendering flows through the catch-all route at [frontend/src/app/(site)/[[...path]]/page.tsx](frontend/src/app/(site)/%5B%5B...path%5D%5D/page.tsx): it calls `fetchLayoutData()` then renders `Placeholder` slots.
- Layout data fetcher in [frontend/src/lib/services/layout.ts](frontend/src/lib/services/layout.ts) switches on `CMS_MODE`:
  - mock (default): calls this app’s /api/layout.
  - custom: calls `CMS_LAYOUT_URL`.
- Rendering pipeline: `Placeholder` maps CMS components to React components via `getComponent()` in [frontend/src/lib/rendering/componentFactory.ts](frontend/src/lib/rendering/componentFactory.ts); add new components there and implement the component under frontend/src/components.

## Payload CMS integration
- Payload is embedded in the Next app under (payload):
  - Admin UI: [frontend/src/app/(payload)/admin/[[...segments]]/page.tsx](frontend/src/app/(payload)/admin/%5B%5B...segments%5D%5D/page.tsx)
  - REST API: [frontend/src/app/(payload)/cms-api/[...slug]/route.ts](frontend/src/app/(payload)/cms-api/%5B...slug%5D/route.ts)
  - GraphQL: [frontend/src/app/(payload)/graphql/route.ts](frontend/src/app/(payload)/graphql/route.ts)
- Config lives in [frontend/payload.config.ts](frontend/payload.config.ts) (MongoDB adapter, collections, globals). Generated types are in [frontend/src/payload-types.ts](frontend/src/payload-types.ts) and should not be edited manually.

## Local dev workflow
- Install and run from repo root: `npm install`, `npm run dev` (see [README.md](README.md) and [Docs/local-dev-checklist.md](Docs/local-dev-checklist.md)).
- Env setup: copy frontend/.env.example to frontend/.env.local and set Clerk + Payload + MongoDB variables (details in [Docs/backend-admin-and-auth.md](Docs/backend-admin-and-auth.md)).
- Payload admin setup: visit /admin to create the first user after running dev server.

## Project-specific conventions
- App Router pages use page.tsx; route params are Promises in Next 16, so pages await `params` (example in [Docs/creating-pages-and-props.md](Docs/creating-pages-and-props.md)).
- The legacy pages router exists under frontend/legacy-pages-router for reference only; the live app uses App Router under frontend/src/app.
- When adding CMS-driven sections, update component mapping in `getComponent()` and ensure the placeholder name matches the CMS layout data shape (see [frontend/src/lib/types/cms.ts](frontend/src/lib/types/cms.ts)).

## Integration points
- Clerk for auth, Payload for CMS, MongoDB for storage (see [Docs/backend-admin-and-auth.md](Docs/backend-admin-and-auth.md)).
- `CMS_MODE` toggles layout data source; keep mock mode working for local onboarding.
