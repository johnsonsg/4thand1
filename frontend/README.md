# Headless CMS + Next.js (Learning Sandbox)

This repo is a beginner-friendly sandbox to learn a **headless CMS rendering model** using **Next.js + React + TypeScript**.

It starts with a **mock layout service** so you can learn the rendering pipeline before you have a real CMS backend.

## Quick Start

```bash
npm install
npm run dev
```

To connect to a real backend later, copy `.env.example` to `.env.local` and set `CMS_MODE=custom`.

Open:

- `http://localhost:3000/`
- `http://localhost:3000/about`
- `http://localhost:3000/tickets`

## Key Files

- Catch-all route (CMS-driven routing): `src/pages/[[...path]].tsx`
- Mock layout endpoint: `src/pages/api/layout.ts`
- Placeholder renderer: `src/components/rendering/Placeholder.tsx`
- Component mapping: `src/lib/rendering/componentFactory.ts`

## CMS Modes

- `CMS_MODE=mock` (default): uses the local mock layout endpoint.
- `CMS_MODE=custom`: calls your backend layout endpoint (`CMS_LAYOUT_URL`).

## Notes

- This repo is intentionally small and “hand-rolled” so you can see the moving parts.
