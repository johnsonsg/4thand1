# Domain → tenant mapping + Clerk org check (implementation outline)

This doc describes how to add custom domain mapping and auth scoping. Nothing here is implemented yet.

---

## Goal
- Allow teams to use their own domain (e.g., `eaglesfootball.com`).
- Resolve that domain to a tenantId in the app.
- Ensure only users in the correct **Clerk Organization** can manage that tenant.

---

## 1) Add a Domain Mapping collection
Create a Payload collection (example: `tenant-domains`) with fields:
- `domain` (text, unique, normalized to lowercase)
- `tenantId` (text)
- `status` (optional: pending/active)
- `notes` (optional)

Admin UI uses this table to map a domain to a tenant.

---

## 2) Update tenant resolver
Enhance `resolveTenant` to:
1) Read host from request.
2) If host matches a known custom domain in `tenant-domains`, return the mapped tenantId.
3) Otherwise fall back to subdomain parsing.

Pseudo-flow:
```
host = request.host
if domainMapping exists for host:
  tenantId = mapping.tenantId
else if host is subdomain:
  tenantId = subdomain
else
  tenantId = default
```

---

## 3) Clerk Organization mapping
Add a field to the tenant settings record:
- `clerkOrgId`

When a user logs into `/admin`:
- Read their Clerk org membership
- Compare to the current tenant’s `clerkOrgId`
- If mismatch, block access or redirect

---

## 4) Admin access guard
Implement a guard in the admin entry or API routes:
- If user is not in the correct org, return 403
- This ensures tenant isolation for edits

---

## 5) Onboarding flow (manual)
1) Team requests custom domain.
2) You add the domain in `tenant-domains` admin.
3) You create a Clerk org for that team.
4) Save the org ID into that tenant’s settings.
5) Team logs in and only sees their tenant data.

---

## 6) Optional automation
- Self‑serve domain add + verification
- Auto‑provision Clerk org
- Auto‑seed tenant settings

---

## Files to touch (when implementing)
- `src/lib/tenancy/resolveTenant.ts` (add domain lookup)
- `payload.config.ts` (register `tenant-domains` collection)
- `src/collections/TenantDomains.ts` (new collection)
- `src/collections/TenantSettings.ts` (add `clerkOrgId`)
- Admin auth guard (new middleware or hook)

---

## Notes
- Keep a safe fallback for localhost/dev (default tenant).
- Normalize domains (lowercase, strip port, remove trailing dot).
