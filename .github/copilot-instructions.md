# Copilot Instructions

## Architecture & data flow
- Monorepo root uses npm workspaces; the app lives in frontend and runs from repo root.
- Next.js App Router under frontend/src/app with route groups: (site) for the public site and (payload) for Payload admin/API (see [Docs/routing-and-pages.md](Docs/routing-and-pages.md)).
- CMS-driven routing is the catch-all page at [frontend/src/app/(site)/[[...path]]/page.tsx](frontend/src/app/(site)/%5B%5B...path%5D%5D/page.tsx): it calls `fetchLayoutData()` and renders `Placeholder` slots.
- Layout data fetching is centralized in [frontend/src/lib/services/layout.ts](frontend/src/lib/services/layout.ts) and switches by `CMS_MODE` (mock uses [frontend/src/app/(site)/api/layout/route.ts](frontend/src/app/(site)/api/layout/route.ts); custom uses `CMS_LAYOUT_URL`).
- Rendering pipeline: `Placeholder` in [frontend/src/lib/utils/Placeholder.tsx](frontend/src/lib/utils/Placeholder.tsx) maps CMS `ComponentRendering` items to React components via `getComponent()` in [frontend/src/lib/utils/componentFactory.ts](frontend/src/lib/utils/componentFactory.ts). Add new components under frontend/src/components and register them in `getComponent()`.
- Layout JSON contract is typed in [frontend/src/lib/types/cms.ts](frontend/src/lib/types/cms.ts); placeholder names in layout data must match `Placeholder` usage.
- Payload runs inside Next under (payload): admin [frontend/src/app/(payload)/admin/[[...segments]]/page.tsx](frontend/src/app/(payload)/admin/%5B%5B...segments%5D%5D/page.tsx), REST [frontend/src/app/(payload)/cms-api/[...slug]/route.ts](frontend/src/app/(payload)/cms-api/%5B...slug%5D/route.ts), GraphQL [frontend/src/app/(payload)/graphql/route.ts](frontend/src/app/(payload)/graphql/route.ts). Config in [frontend/payload.config.ts](frontend/payload.config.ts); generated types in [frontend/src/payload-types.ts](frontend/src/payload-types.ts).
- Multi-tenant resolution is via `resolveTenantFromHeaders()` in [frontend/src/lib/tenancy/resolveTenant.ts](frontend/src/lib/tenancy/resolveTenant.ts). Tenant-scoped settings live in [frontend/src/collections/TenantSettings.ts](frontend/src/collections/TenantSettings.ts) with access + beforeChange enforcing `tenantId`.
- Theme tokens are injected at render time by `ThemeTokensEffect` in [frontend/src/lib/theme/ThemeTokensEffect.tsx](frontend/src/lib/theme/ThemeTokensEffect.tsx) and wired in the catch-all page.

## Developer workflows
- Dev: `npm install` then `npm run dev` from repo root (see [Docs/local-dev-checklist.md](Docs/local-dev-checklist.md)).
- Env: copy frontend/.env.example to frontend/.env.local and set Clerk + Payload + MongoDB vars (see [Docs/backend-admin-and-auth.md](Docs/backend-admin-and-auth.md)).
- Payload admin custom fields/components: regenerate import map via `npm run generate:importmap -w frontend`.
- Onboarding demo route: [frontend/src/app/(site)/demo/[slug]/page.tsx](frontend/src/app/(site)/demo/%5Bslug%5D/page.tsx); `params` is a Promise in Next 16 (await it) per [Docs/creating-pages-and-props.md](Docs/creating-pages-and-props.md).

## Project-specific conventions
- App Router routes must use page.tsx/layout.tsx; legacy pages router under frontend/legacy-pages-router is reference-only.
- When adding CMS-driven sections, update `getComponent()` and keep CMS layout placeholder names aligned with [frontend/src/lib/types/cms.ts](frontend/src/lib/types/cms.ts).
