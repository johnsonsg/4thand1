# Stat Tracker Feature App — Codex Agent Handoff

Use this document as a **copy/paste prompt** for another Codex agent to scaffold and configure a separate Stat Tracker app that integrates with our existing ecosystem.

---

## How to use this file

1. Open a new Codex session in the root of the **new/separate Stat Tracker repository**.
2. Copy everything inside the section **“Prompt to paste into Codex”**.
3. Paste it into Codex and let it execute.

---

## Prompt to paste into Codex

You are setting up a **separate feature app** called **Stat Tracker** for a multi-tenant school/team platform.

### Context and non-negotiables

- This is a separate app/repo from the main site, but it must integrate with the same platform standards.
- Multi-tenant model: each school/team is a tenant.
- Authentication must use **Clerk**.
- Database must be **MongoDB**.
- Use tenant resolution compatible with this priority:
  1) subdomain
  2) custom domain mapping
  3) `x-tenant-id` header override (for testing)
  4) default tenant fallback
- Keep implementation minimal/MVP and production-safe.
- Use TypeScript.

### What to build

Create a production-ready baseline app with:

1. **Next.js App Router** app
2. **Clerk auth integration** (middleware + protected routes)
3. **MongoDB connection layer**
4. **Tenant resolution utility**
5. **Tenant-scoped data model for stat tracking**
6. Basic API routes for recording and reading stats
7. Minimal docs and env template

### Required data model (minimum)

Implement Mongo/Mongoose schemas (or equivalent) with `tenantId` required on all tenant-owned data:

- `Tenant`
  - `tenantId` (unique)
  - `name`
  - `domains` (array of domains)
  - `clerkOrgId` (optional, recommended)
  - timestamps

- `Player`
  - `tenantId`
  - `externalPlayerId` (optional)
  - `firstName`
  - `lastName`
  - `jerseyNumber` (optional)
  - `position` (optional)
  - `isActive`
  - timestamps

- `Game`
  - `tenantId`
  - `opponent`
  - `gameDate`
  - `homeAway` (`home` | `away`)
  - `season`
  - `status` (`scheduled` | `in_progress` | `final`)
  - timestamps

- `PlayerGameStats`
  - `tenantId`
  - `gameId`
  - `playerId`
  - passing/rushing/receiving/tackles/sacks/interceptions/tds (numeric, default 0)
  - timestamps
  - unique index on (`tenantId`, `gameId`, `playerId`)

- `TeamGameStats`
  - `tenantId`
  - `gameId`
  - totals fields (pointsFor, pointsAgainst, totalYards, penalties, turnovers, etc.)
  - timestamps
  - unique index on (`tenantId`, `gameId`)

### API requirements

Build these route handlers:

- `POST /api/stats/player-game`
  - upsert a player's game stats for a tenant
- `GET /api/stats/player-game?tenantId=&gameId=`
  - list all player stats for a game
- `POST /api/stats/team-game`
  - upsert team game stats
- `GET /api/stats/team-game?tenantId=&gameId=`
  - get team stats for a game
- `GET /api/players?tenantId=`
- `POST /api/players`
- `GET /api/games?tenantId=&season=`
- `POST /api/games`

### Auth + authorization requirements

- Use Clerk middleware to protect `/app/**` and all write API routes.
- For write endpoints, require authenticated user.
- Tenant guard:
  - infer tenant from host/header
  - reject writes if body/query `tenantId` does not match resolved tenant
- If Clerk org is available, verify org matches tenant mapping when configured.

### Tenant resolution requirements

Implement `resolveTenantFromRequest(req)` with:

1. Parse host (`x-forwarded-host` fallback).
2. If host matches known tenant domain mapping, use that tenant.
3. Else if host is subdomain (`<tenant>.domain.com`), use subdomain as tenantId.
4. Else if `x-tenant-id` header present, use it.
5. Else fallback to `DEFAULT_TENANT_ID`.

Normalize host (lowercase, strip port, trim trailing dot).

### Project structure expectation

Use something similar:

- `src/app/api/...` route handlers
- `src/lib/db/mongodb.ts`
- `src/lib/tenancy/resolveTenant.ts`
- `src/lib/auth/tenantGuard.ts`
- `src/models/*.ts`
- `src/types/*.ts`

### Environment variables

Create `.env.example` with at least:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=`
- `CLERK_SECRET_KEY=`
- `MONGODB_URI=`
- `DEFAULT_TENANT_ID=default`
- `BASE_DOMAIN=localhost`

If using Clerk org checks:

- `CLERK_ENFORCE_ORG_MATCH=true`

### Commands to run

Use npm and run all setup steps, including package installation.

Install minimum packages:

- `next react react-dom`
- `typescript @types/node @types/react @types/react-dom`
- `mongoose`
- `@clerk/nextjs`
- `zod`

Include scripts in `package.json`:

- `dev`
- `build`
- `start`
- `lint`
- `typecheck`

### MVP UI requirements

Create a protected page at `/app` that:

- Shows resolved `tenantId`
- Lists games for tenant
- Allows simple form submit to create game
- Links to a game detail page with player stat entry form

Keep UI basic and functional; no design polish needed.

### Validation and hardening

- Validate request payloads with `zod`.
- Enforce tenant scoping in every DB query.
- Add indexes for frequent query patterns.
- Return clear error responses (`400`, `401`, `403`, `404`, `500`).

### Deliverables

When done, output:

1. What files were created/updated
2. Commands run
3. Any assumptions made
4. Exact local run steps
5. Example curl requests for each API

### Acceptance criteria

- App runs locally with `npm run dev`
- Clerk sign-in works
- MongoDB connects successfully
- Tenant resolution works for host/header/default
- Can create/read games
- Can upsert/read team + player game stats
- All writes are tenant-guarded

### Important implementation style

- Keep it minimal and clear.
- Do not add unrelated features.
- Use explicit, readable naming.
- Add concise README setup notes.

---

If anything is ambiguous, choose the simplest approach that satisfies the requirements and continue.
