# Copilot Instructions

## Big-picture architecture
- Monorepo root uses npm workspaces; the app lives in frontend with root scripts delegating to workspace (see [package.json](package.json) and [frontend/package.json](frontend/package.json)).
- Next.js App Router structure under frontend/src/app with route groups: (site) for public site and (payload) for Payload admin/API (see [Docs/routing-and-pages.md](Docs/routing-and-pages.md)).
- CMS-driven rendering flows through the catch-all route at [frontend/src/app/(site)/[[...path]]/page.tsx](frontend/src/app/(site)/%5B%5B...path%5D%5D/page.tsx): it calls `fetchLayoutData()` then renders `Placeholder` slots.
- Layout data fetcher in [frontend/src/lib/services/layout.ts](frontend/src/lib/services/layout.ts) switches on `CMS_MODE`:
  - mock (default): calls this app’s [frontend/src/app/(site)/api/layout/route.ts](frontend/src/app/(site)/api/layout/route.ts)
  - custom: calls `CMS_LAYOUT_URL`
- Rendering pipeline: `Placeholder` in [frontend/src/lib/utils/Placeholder.tsx](frontend/src/lib/utils/Placeholder.tsx) maps CMS components to React components via `getComponent()` in [frontend/src/lib/utils/componentFactory.ts](frontend/src/lib/utils/componentFactory.ts); add new components under frontend/src/components and register them in `getComponent()`.
- Layout JSON contract is typed in [frontend/src/lib/types/cms.ts](frontend/src/lib/types/cms.ts) (`CmsLayoutData`, `RouteData`, `ComponentRendering`). Keep placeholder names in layout data aligned with `Placeholder` usage (e.g., `name="main"`).

## Payload CMS integration
- Payload is embedded in the Next app under (payload):
  - Admin UI: [frontend/src/app/(payload)/admin/[[...segments]]/page.tsx](frontend/src/app/(payload)/admin/%5B%5B...segments%5D%5D/page.tsx)
  - REST API: [frontend/src/app/(payload)/cms-api/[...slug]/route.ts](frontend/src/app/(payload)/cms-api/%5B...slug%5D/route.ts)
  - GraphQL: [frontend/src/app/(payload)/graphql/route.ts](frontend/src/app/(payload)/graphql/route.ts)
- Config lives in [frontend/payload.config.ts](frontend/payload.config.ts) (MongoDB adapter, collections, globals). Generated types are in [frontend/src/payload-types.ts](frontend/src/payload-types.ts) and should not be edited manually.
- The mock layout endpoint in [frontend/src/app/(site)/api/layout/route.ts](frontend/src/app/(site)/api/layout/route.ts) pulls Payload globals (hero, brand, schedule, stats, theme) and normalizes media URLs to /media.

## Local dev workflow
- Install and run from repo root: `npm install`, `npm run dev` (see [README.md](README.md) and [Docs/local-dev-checklist.md](Docs/local-dev-checklist.md)).
- Env setup: copy frontend/.env.example to frontend/.env.local and set Clerk + Payload + MongoDB variables (details in [Docs/backend-admin-and-auth.md](Docs/backend-admin-and-auth.md)).
- Payload admin setup: visit /admin to create the first user after running dev server.
- If you add Payload admin custom fields/components, regenerate the import map: `npm run generate:importmap -w frontend` (see [Docs/local-dev-checklist.md](Docs/local-dev-checklist.md)).

## Project-specific conventions
- App Router pages use page.tsx; route params are Promises in Next 16, so pages await `params` (example in [Docs/creating-pages-and-props.md](Docs/creating-pages-and-props.md)).
- The legacy pages router exists under frontend/legacy-pages-router for reference only; the live app uses App Router under frontend/src/app.
- When adding CMS-driven sections, update component mapping in `getComponent()` and ensure the placeholder name matches the CMS layout data shape (see [frontend/src/lib/types/cms.ts](frontend/src/lib/types/cms.ts)).
- Theme tokens are injected at render time in [frontend/src/app/(site)/[[...path]]/page.tsx](frontend/src/app/(site)/%5B%5B...path%5D%5D/page.tsx) via `ThemeTokensEffect` and inline CSS variables; keep token names aligned with [frontend/src/lib/theme/ThemeTokensEffect.tsx](frontend/src/lib/theme/ThemeTokensEffect.tsx).

## Integration points
- Clerk for auth, Payload for CMS, MongoDB for storage (see [Docs/backend-admin-and-auth.md](Docs/backend-admin-and-auth.md)).
- `CMS_MODE` toggles layout data source; keep mock mode working for local onboarding.
