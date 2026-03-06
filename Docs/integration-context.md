# 4thand1 App Context (for External Integration)

## High-Level Overview
- Monorepo with npm workspaces; main app in `frontend/`.
- Next.js App Router with Payload CMS embedded for admin + APIs.
- CMS-style rendering pipeline: layout JSON → Placeholder → componentFactory → React components.
- Multi-tenant data model: tenant-scoped settings stored in `tenant-settings` collection.

## Core Architecture
- App Router: `frontend/src/app/`
  - `(site)` for public routes, including CMS catch-all.
  - `(payload)` for Payload admin/API routes.
- CMS-driven routing:
  - Catch-all route: `frontend/src/app/(site)/[[...path]]/page.tsx`
  - Layout fetcher: `frontend/src/lib/services/layout.ts`
  - Placeholder renderer: `frontend/src/lib/utils/Placeholder.tsx`
  - Component mapping: `frontend/src/lib/utils/componentFactory.ts`
- Mock layout API:
  - `frontend/src/app/(site)/api/layout/route.ts`
  - Provides layout JSON for routes and merges tenant settings + globals.
- Payload config:
  - `frontend/payload.config.ts`
  - Collections: `Users`, `Media`, `TenantSettings`
  - Globals: Hero, Brand, Theme, Stats, Schedule

## Multi-Tenancy Model
- Tenant resolution:
  - `frontend/src/lib/tenancy/resolveTenant.ts`
  - Uses `x-tenant-id` header if present; otherwise falls back to `DEFAULT_TENANT_ID`.
- Tenant settings collection:
  - `frontend/src/collections/TenantSettings.ts`
  - Contains brand, hero, theme, stats, schedule, contact, metadata, players, news.
  - Auto-populates `tenantId` (server) and client-side using brand name.
  - Ensures unique tenant IDs by suffixing (`-2`, `-3`, …) before validation.
  - Admin list access now allows all tenants for authenticated users.

## Tenant Switching (No DNS Required)
- Middleware injects tenant selection:
  - `frontend/middleware.ts`
  - Supports `?tenant=...` and a `tenantId` cookie.
  - Injects `x-tenant-id` into request headers.
- Layout fetch forwarding:
  - `frontend/src/lib/services/layout.ts`
  - For mock mode, forwards `x-tenant-id` and adds `tenant` query param to `/api/layout`.
  - Disables fetch caching to avoid cross-tenant leakage.
- Layout API:
  - `frontend/src/app/(site)/api/layout/route.ts`
  - Accepts `?tenant=...` query param fallback for tenant selection.

### How to Preview a Tenant
- URL format: `http://localhost:3000/?tenant=manchester-lancers`
- Tenant selection persists via cookie after first visit.

## Recent Fixes and Enhancements
- Tenant ID auto-population now works:
  - Client-side field: `frontend/src/components/admin/TenantIdField.tsx`
  - Server-side hooks in `TenantSettings`:
    - `beforeValidate`: derive tenantId from brandName or request tenant.
    - unique ID suffix handling.
- Tenant list visibility fixed by relaxing read access for authenticated users.
- Layout fetch now includes tenant info + no-store caching.

## Developer Workflow
- Install + dev: `npm install` then `npm run dev` (from repo root).
- Env setup: copy `frontend/.env.example` → `frontend/.env.local`.
- Required env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `PAYLOAD_SECRET`, `MONGODB_URI`, `PAYLOAD_PUBLIC_SERVER_URL`.
- Payload admin URL: `/admin`.
- Payload API: `/cms-api`.

## Integration Notes (External App)
- To render tenant-specific content, supply either:
  - `x-tenant-id` header, or
  - `?tenant=...` query param (for mock layout API).
- Layout data contract is defined in `frontend/src/lib/types/cms.ts`.
- For CMS_MODE=custom, provide `CMS_LAYOUT_URL` that returns the same layout JSON shape.

## Component Library, Theme & Styling
- Component inventory lives in `frontend/src/components/` and is wired into the CMS renderer via:
  - `frontend/src/lib/utils/componentFactory.ts` (componentName → React component)
  - `frontend/src/lib/utils/Placeholder.tsx` (renders placeholder arrays)
- CMS-driven “sections” are standard React components; new components must be registered in `getComponent()`.
- Theming pipeline:
  - Theme tokens are stored per-tenant in `tenant-settings` and normalized in the mock layout API.
  - Server injects theme data into CMS context.
  - `frontend/src/lib/theme/ThemeTokensEffect.tsx` applies theme tokens at render.
  - `frontend/src/lib/theme/buildThemeStyle.ts` builds CSS variables for the page.
- Tailwind is configured in `frontend/tailwind.config.js` and global styles in `frontend/src/styles/globals.css`.
- Payload admin UI uses custom components and MUI:
  - Example: `frontend/src/components/ColorPickerField.tsx`
  - Admin tabs: `frontend/src/components/admin/TenantSettingsTabs.tsx`
  - Tenant ID field: `frontend/src/components/admin/TenantIdField.tsx`

## Key Files
- CMS route: `frontend/src/app/(site)/[[...path]]/page.tsx`
- Mock layout API: `frontend/src/app/(site)/api/layout/route.ts`
- Layout fetcher: `frontend/src/lib/services/layout.ts`
- Tenant settings: `frontend/src/collections/TenantSettings.ts`
- Tenant resolution: `frontend/src/lib/tenancy/resolveTenant.ts`
- Middleware tenant override: `frontend/middleware.ts`
- Component mapping: `frontend/src/lib/utils/componentFactory.ts`
- Placeholder renderer: `frontend/src/lib/utils/Placeholder.tsx`
