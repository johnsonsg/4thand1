# Multi-tenant outline (shared code, per-customer data)

This project can support a multi-tenant SaaS model where **one codebase/deploy** serves **many customers**, each with **their own data, theme, and auth scope**.

## 1) Tenant resolution (who is the customer?)
Choose one routing strategy:

- **Subdomain**: `schoolA.yourapp.com` → tenant `schoolA`
- **Custom domain**: `eaglesfootball.com` → tenant `eagles`
- **Path prefix**: `/t/schoolA/...` (least ideal for SEO)

Implement a resolver (middleware or server utility) that maps host/path → `tenantId`.

## 2) Data isolation
Two common patterns:

### A) Single DB, `tenantId` field (simplest)
- Add `tenantId` to all Payload collections and globals.
- Every query is scoped by `tenantId`.
- One Mongo instance.

### B) Separate DB per tenant (strongest isolation)
- Each tenant has its own Mongo URI.
- Resolve tenant → DB connection in Payload config.
- More operational overhead, best for strict isolation requirements.

## 3) Theme per tenant (CMS-driven tokens)
Store theme tokens per tenant (Payload Global or collection):

- `theme.light` / `theme.dark` tokens
- On each request: resolve tenant → fetch theme → set CSS variables

This repo already supports token-based theme injection via:
- `ThemeTokensEffect`
- `buildThemeStyle`

## 4) Auth per tenant (Clerk)
Use **Clerk Organizations**:

- Each customer = an Org
- Users belong to Org(s)
- Map Org → `tenantId`
- On request: verify user’s Org matches current tenant

## 5) Routing model
One shared Next.js app:

- Public pages render tenant-specific content + theme
- Admin area uses the same app, but all data is scoped by tenant

## 6) Deploy model
- One codebase + single deploy → all customers see updates
- Per-tenant data lives in DB/Clerk, not in code

## 7) Changes needed in this repo (when ready)
Minimal initial steps:

1) Add a tenant resolver (middleware or server utility).
2) Update theme fetch to read per-tenant tokens (instead of a single JSON file).
3) Scope Payload data by `tenantId`.
4) Map Clerk org → `tenantId`.

## Next step (if you want implementation)
I can scaffold:

- A tenant resolver utility
- Tenant-scoped theme fetch
- Example Payload collection/global changes for `tenantId`
- Clerk org → tenant mapping helpers

### Safe first-step implementation (non-breaking)
If you want, I can implement the first step (tenant resolver + theme fetch) **without changing existing behavior**:

1) Add a tenant resolver with a **default tenant** fallback.
2) Make theme fetch read tenant‑specific tokens **only if present**; otherwise use current defaults.
3) Keep all existing routes and layout behavior unchanged.

This keeps the current app working while preparing for multi‑tenant data.
