# Tenants (multi-school setup)

## What is a tenant?
A **tenant** is one school/customer in a shared app. Each tenant has:

- Its own theme (colors)
- Its own brand settings (logo/mark/motto)
- Its own hero content, schedule, stats, etc.

All tenants share **the same codebase and deployment**, so updates to the app go live for everyone at once.

---

## How a tenant is identified
We resolve a tenant per request using:

1) **Subdomain** (preferred)
   - `westfield.yourapp.com` → tenantId = `westfield`
2) **Custom domain**
   - `eaglesfootball.com` → tenantId mapped from domain (optional future step)
3) **Header override**
   - `x-tenant-id` header (useful for testing)
4) **Fallback**
   - If none found, use `DEFAULT_TENANT_ID` or `default`

Resolver: [frontend/src/lib/tenancy/resolveTenant.ts](../frontend/src/lib/tenancy/resolveTenant.ts)

---

## Where tenant data lives
Tenant-specific data is stored in Payload **Tenant Settings**:

- Collection: `tenant-settings`
- One document per tenantId

Fields include:
- `brand` (logo/mark/motto)
- `hero` (headline, CTAs, background image)
- `theme` (light/dark tokens)
- `stats` (stats bar)
- `schedule` (games + labels)

Collection: [frontend/src/collections/TenantSettings.ts](../frontend/src/collections/TenantSettings.ts)

---

## How it’s used at runtime
When a request comes in:

1) Resolve `tenantId`
2) Load tenant settings (if present)
3) Fall back to existing globals if tenant data is missing
4) Build layout JSON + theme tokens for that tenant

Layout API: [frontend/src/app/(site)/api/layout/route.ts](../frontend/src/app/(site)/api/layout/route.ts)

---

## Auto-seeding (first visit)
On first visit for a new tenant, the app auto-creates a tenant settings record by copying the current global settings.

This keeps onboarding simple while preserving existing behavior.

---

## How to add a new school
1) Point a subdomain to the app (e.g. `lincoln.yourapp.com`).
2) Visit the site once → auto-seeds the Tenant Settings.
3) Go to `/admin` and edit Tenant Settings.
4) That school’s site updates without affecting others.

---

## Why this is safe
- If tenant settings are missing, the app **falls back** to current global settings.
- Existing routes and features keep working.
- You can onboard tenants gradually.

---

## Notes / future improvements
- Add a domain→tenant mapping table for custom domains.
- Add a “Create Tenant” admin wizard.
- Enforce tenant scoping at the auth layer (Clerk org → tenantId).
