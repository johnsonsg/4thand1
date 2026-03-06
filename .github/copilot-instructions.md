

# Copilot Instructions

## Architecture & Data Flow
- **Monorepo root** uses npm workspaces; main app is in `frontend/`, run commands from repo root.
- **Next.js App Router** lives in `frontend/src/app/` with route groups: `(site)` for public site, `(payload)` for Payload admin/API.
- **CMS-driven routing**: catch-all [frontend/src/app/(site)/[[...path]]/page.tsx](frontend/src/app/(site)/%5B%5B...path%5D%5D/page.tsx) calls `fetchLayoutData()` and renders `Placeholder` slots.
- **Layout data**: [frontend/src/lib/services/layout.ts](frontend/src/lib/services/layout.ts) switches by `CMS_MODE` (mock: [frontend/src/app/(site)/api/layout/route.ts](frontend/src/app/(site)/api/layout/route.ts); custom: `CMS_LAYOUT_URL`).
- **Rendering pipeline**: `Placeholder` ([frontend/src/lib/utils/Placeholder.tsx](frontend/src/lib/utils/Placeholder.tsx)) maps CMS `ComponentRendering` to React via `getComponent()` ([frontend/src/lib/utils/componentFactory.ts](frontend/src/lib/utils/componentFactory.ts)). Add components under `frontend/src/components/` and register in `getComponent()`.
- **Layout JSON contract**: typed in [frontend/src/lib/types/cms.ts](frontend/src/lib/types/cms.ts); placeholder names in layout data must match `Placeholder` usage.
- **Payload CMS** runs inside Next under `(payload)`:
	- Admin UI: [frontend/src/app/(payload)/admin/[[...segments]]/page.tsx](frontend/src/app/(payload)/admin/%5B%5B...segments%5D%5D/page.tsx)
	- REST: [frontend/src/app/(payload)/cms-api/[...slug]/route.ts](frontend/src/app/(payload)/cms-api/%5B...slug%5D/route.ts)
	- GraphQL: [frontend/src/app/(payload)/graphql/route.ts](frontend/src/app/(payload)/graphql/route.ts)
	- Config: [frontend/payload.config.ts](frontend/payload.config.ts); generated types in [frontend/src/payload-types.ts](frontend/src/payload-types.ts)
- **Multi-tenancy**: `resolveTenantFromHeaders()` ([frontend/src/lib/tenancy/resolveTenant.ts](frontend/src/lib/tenancy/resolveTenant.ts)); tenant-scoped settings in [frontend/src/collections/TenantSettings.ts](frontend/src/collections/TenantSettings.ts) enforced by access + `beforeChange` hooks.
- **Theme tokens**: injected at render by `ThemeTokensEffect` ([frontend/src/lib/theme/ThemeTokensEffect.tsx](frontend/src/lib/theme/ThemeTokensEffect.tsx)), wired in the CMS catch-all page.

## Developer Workflows
- **Dev**: `npm install` then `npm run dev` from repo root ([Docs/local-dev-checklist.md](Docs/local-dev-checklist.md)).
- **Env setup**: copy `frontend/.env.example` → `frontend/.env.local`, set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `PAYLOAD_SECRET`, `MONGODB_URI`, `PAYLOAD_PUBLIC_SERVER_URL` ([Docs/backend-admin-and-auth.md](Docs/backend-admin-and-auth.md)).
- **Payload admin custom fields/components**: regenerate import map via `npm run generate:importmap -w frontend`.
- **Onboarding demo**: [frontend/src/app/(site)/demo/[slug]/page.tsx](frontend/src/app/(site)/demo/%5Bslug%5D/page.tsx); `params` is a Promise in Next 16 (must `await`) ([Docs/creating-pages-and-props.md](Docs/creating-pages-and-props.md)).
- **CMS modes**: `CMS_MODE=mock` (default, uses local layout API), `CMS_MODE=custom` (calls backend layout via `CMS_LAYOUT_URL`).

## Project-Specific Conventions
- **App Router only**: use `page.tsx`/`layout.tsx`; legacy router in `frontend/legacy-pages-router/` is reference-only.
- **CMS-driven sections**: update `getComponent()` and keep CMS placeholder names aligned with [frontend/src/lib/types/cms.ts](frontend/src/lib/types/cms.ts).

## Key References
- [Docs/README.md](Docs/README.md)
- [frontend/README.md](frontend/README.md)
- [Docs/routing-and-pages.md](Docs/routing-and-pages.md)
- [Docs/local-dev-checklist.md](Docs/local-dev-checklist.md)
- [Docs/backend-admin-and-auth.md](Docs/backend-admin-and-auth.md)

---
Feedback: If any section is unclear or missing, please specify so it can be improved for future AI agents.
