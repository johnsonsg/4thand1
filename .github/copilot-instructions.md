

# Copilot Instructions

## Architecture & Data Flow
- **Monorepo root** uses npm workspaces; main app is in `frontend/`, run from repo root.
- **Next.js App Router**: `frontend/src/app/` with route groups: `(site)` for public site, `(payload)` for Payload admin/API ([Docs/routing-and-pages.md](Docs/routing-and-pages.md)).
- **CMS-driven routing**: catch-all at [frontend/src/app/(site)/[[...path]]/page.tsx](frontend/src/app/(site)/%5B%5B...path%5D%5D/page.tsx) calls `fetchLayoutData()` and renders `Placeholder` slots.
- **Layout data**: fetched in [frontend/src/lib/services/layout.ts](frontend/src/lib/services/layout.ts), switches by `CMS_MODE` (mock: [frontend/src/app/(site)/api/layout/route.ts](frontend/src/app/(site)/api/layout/route.ts), custom: `CMS_LAYOUT_URL`).
- **Rendering pipeline**: `Placeholder` ([frontend/src/lib/utils/Placeholder.tsx](frontend/src/lib/utils/Placeholder.tsx)) maps CMS `ComponentRendering` to React via `getComponent()` ([frontend/src/lib/utils/componentFactory.ts](frontend/src/lib/utils/componentFactory.ts)). Add new components under `frontend/src/components/` and register in `getComponent()`.
- **Layout JSON contract**: typed in [frontend/src/lib/types/cms.ts](frontend/src/lib/types/cms.ts); placeholder names in layout data must match `Placeholder` usage.
- **Payload CMS**: runs inside Next under `(payload)`:
	- Admin: [frontend/src/app/(payload)/admin/[[...segments]]/page.tsx](frontend/src/app/(payload)/admin/%5B%5B...segments%5D%5D/page.tsx)
	- REST: [frontend/src/app/(payload)/cms-api/[...slug]/route.ts](frontend/src/app/(payload)/cms-api/%5B...slug%5D/route.ts)
	- GraphQL: [frontend/src/app/(payload)/graphql/route.ts](frontend/src/app/(payload)/graphql/route.ts)
	- Config: [frontend/payload.config.ts](frontend/payload.config.ts)
	- Types: [frontend/src/payload-types.ts](frontend/src/payload-types.ts)
- **Multi-tenancy**: `resolveTenantFromHeaders()` ([frontend/src/lib/tenancy/resolveTenant.ts](frontend/src/lib/tenancy/resolveTenant.ts)); tenant-scoped settings in [frontend/src/collections/TenantSettings.ts](frontend/src/collections/TenantSettings.ts), enforced by access + `beforeChange` hooks.
- **Theme tokens**: injected at render by `ThemeTokensEffect` ([frontend/src/lib/theme/ThemeTokensEffect.tsx](frontend/src/lib/theme/ThemeTokensEffect.tsx)), wired in catch-all page.

## Developer Workflows
- **Dev**: `npm install` then `npm run dev` from repo root ([Docs/local-dev-checklist.md](Docs/local-dev-checklist.md)).
- **Env setup**: copy `frontend/.env.example` to `frontend/.env.local`, set Clerk + Payload + MongoDB vars ([Docs/backend-admin-and-auth.md](Docs/backend-admin-and-auth.md)).
- **Payload admin custom fields/components**: regenerate import map via `npm run generate:importmap -w frontend`.
- **Onboarding demo**: [frontend/src/app/(site)/demo/[slug]/page.tsx](frontend/src/app/(site)/demo/%5Bslug%5D/page.tsx); `params` is a Promise in Next 16 (must `await`) ([Docs/creating-pages-and-props.md](Docs/creating-pages-and-props.md)).
- **CMS modes**: `CMS_MODE=mock` (default, uses mock layout endpoint), `CMS_MODE=custom` (calls backend layout endpoint via `CMS_LAYOUT_URL`).

## Project-Specific Conventions
- **App Router**: use `page.tsx`/`layout.tsx` only; legacy router in `frontend/legacy-pages-router/` is reference-only.
- **CMS-driven sections**: update `getComponent()` and keep CMS layout placeholder names aligned with [frontend/src/lib/types/cms.ts](frontend/src/lib/types/cms.ts).
- **New components**: add under `frontend/src/components/`, register in `getComponent()`.
- **Rendering pipeline**: intentionally "hand-rolled" for clarity; see [frontend/README.md](frontend/README.md).

## Key References
- [Docs/README.md](Docs/README.md): docs overview
- [frontend/README.md](frontend/README.md): CMS mode, rendering pipeline
- [Docs/routing-and-pages.md](Docs/routing-and-pages.md): routing details
- [Docs/local-dev-checklist.md](Docs/local-dev-checklist.md): dev setup

---
Feedback: If any section is unclear or missing, please specify so it can be improved for future AI agents.
