# Theme System (Tailwind + Tokens + Jotai + MUI)

This document describes how theming works in this app so the same approach can be applied to another project.

## 1) Tailwind + CSS Variables
- Base tokens live in [frontend/src/styles/globals.css](../frontend/src/styles/globals.css).
- CSS variables are defined on `:root` for light mode and `html.dark` for dark mode.
- Tailwind is mapped to these variables in [frontend/tailwind.config.js](../frontend/tailwind.config.js), so Tailwind classes like `bg-background` and `text-foreground` resolve to `hsl(var(--...))`.

## 2) Theme Mode State (Jotai)
- Theme mode is stored in `themeModeAtom` in [frontend/src/state/atoms.ts](../frontend/src/state/atoms.ts).
- It persists to browser storage using `atomWithStorage`.

## 3) Dark Mode Class Toggle
- [frontend/src/components/layout/ThemeEffect.tsx](../frontend/src/components/layout/ThemeEffect.tsx) reads `themeModeAtom` and toggles the `html.dark` class.
- It also sets `document.documentElement.style.colorScheme` to the current mode.

## 4) CMS / Tenant Theme Tokens
- Theme tokens are defined in `ThemeConfig` and `ThemeTokens` in [frontend/src/lib/theme/types.ts](../frontend/src/lib/theme/types.ts).
- Tokens can be stored per-tenant in the `tenant-settings` collection and merged in the mock layout API in [frontend/src/app/(site)/api/layout/route.ts](../frontend/src/app/(site)/api/layout/route.ts).
- Tokens are normalized with [frontend/src/lib/theme/normalizeThemeToken.ts](../frontend/src/lib/theme/normalizeThemeToken.ts) (accepts hex or HSL strings).

## 5) Applying Tokens at Render
There are two layers of token application:

### A) SSR/Server Style Injection
- [frontend/src/lib/theme/buildThemeStyle.ts](../frontend/src/lib/theme/buildThemeStyle.ts) generates a `<style>` tag for `:root` and `html.dark` using the theme tokens.
- This is injected on the CMS catch-all page in [frontend/src/app/(site)/[[...path]]/page.tsx](../frontend/src/app/(site)/%5B%5B...path%5D%5D/page.tsx).

### B) Client-Side Token Effect
- [frontend/src/lib/theme/ThemeTokensEffect.tsx](../frontend/src/lib/theme/ThemeTokensEffect.tsx) updates CSS variables based on the current `themeModeAtom` and the `theme` object from CMS layout data.
- It also sets a `--headshot-bg` variable for player headshots.

## 6) Theme Admin API (File-Based)
- `/api/theme` is implemented in [frontend/src/app/(site)/api/theme/route.ts](../frontend/src/app/(site)/api/theme/route.ts).
- It reads/writes theme JSON files via [frontend/src/lib/theme/themeStore.ts](../frontend/src/lib/theme/themeStore.ts).
- Theme files are stored under `data/theme.json` (default) and `data/themes/<tenantId>.json` (tenant-specific).
- The admin UI for editing is in [frontend/src/app/(site)/theme-admin/page.tsx](../frontend/src/app/(site)/theme-admin/page.tsx).

> Note: You mentioned this will eventually be stored in MongoDB. Today it’s file-based (themeStore), while tenant theme tokens also exist on `tenant-settings` and are merged in the layout API.

## 7) MUI Theme (Admin UI)
- MUI theme is created in [frontend/src/theme.ts](../frontend/src/theme.ts), using CSS variables for colors.
- Providers are set up in [frontend/src/app/providers.tsx](../frontend/src/app/providers.tsx) with `ThemeProvider` and `CssBaseline`.

## 8) Theme Toggle UI
- The theme toggle button uses `themeModeAtom` in [frontend/src/components/header/Navbar.tsx](../frontend/src/components/header/Navbar.tsx).
- Switching `themeModeAtom` immediately flips `html.dark` and re-applies token values.

---

## Porting This to Another App (Checklist)
1. Copy Tailwind config mappings and base variables from:
   - [frontend/tailwind.config.js](../frontend/tailwind.config.js)
   - [frontend/src/styles/globals.css](../frontend/src/styles/globals.css)
2. Add `themeModeAtom` and Jotai storage:
   - [frontend/src/state/atoms.ts](../frontend/src/state/atoms.ts)
3. Add `ThemeEffect` for `html.dark` toggling:
   - [frontend/src/components/layout/ThemeEffect.tsx](../frontend/src/components/layout/ThemeEffect.tsx)
4. Add `ThemeTokensEffect` and `buildThemeStyle`:
   - [frontend/src/lib/theme/ThemeTokensEffect.tsx](../frontend/src/lib/theme/ThemeTokensEffect.tsx)
   - [frontend/src/lib/theme/buildThemeStyle.ts](../frontend/src/lib/theme/buildThemeStyle.ts)
5. Ensure layout data supplies a `theme` object (from CMS or a config file).
6. Wire the toggle UI (example in Navbar).
7. If using MUI, reuse the theme config in [frontend/src/theme.ts](../frontend/src/theme.ts).

If you want, I can generate a minimal “starter” version of these files for your other app.
