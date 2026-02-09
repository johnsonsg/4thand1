/* ============================================================
   Imports
   - NextResponse: return JSON responses from route handlers
   - CmsLayout types: your "layout JSON" contract
   - getThemeConfig: theme tokens you attach to CMS context
   - Payload: fetch hero globals from Payload CMS
============================================================ */
import { NextResponse } from 'next/server'
import type { CmsLayoutData, ComponentRendering, Field } from '@/lib/types/cms'
import { getThemeConfig } from '@/lib/theme/themeStore'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/* ============================================================
   Types
   - HeroSettings: shape of data coming from Payload global
   - HeroBackground: shape your HeroSection component expects
============================================================ */
type HeroBackground = {
  src: string
  alt: string
}

type HeroSettings = {
  season?: string | null
  headline?: string | null
  heroDescription?: string | null
  backgroundImage?: {
    url?: string | null
    alt?: string | null
    filename?: string | null
  } | null

  primaryCtaLabel?: string | null
  primaryCtaHref?: string | null
  secondaryCtaLabel?: string | null
  secondaryCtaHref?: string | null
  tertiaryCtaLabel?: string | null
  tertiaryCtaHref?: string | null
  quaternaryCtaLabel?: string | null
  quaternaryCtaHref?: string | null
}

/* ============================================================
   Defaults
   - Used when Payload isn't configured yet or fields are empty
============================================================ */
const DEFAULT_HERO: {
  season: string
  headline: string
  heroDescription: string
  background: HeroBackground
  ctas: Required<
    Pick<
      NonNullable<HeroSettings>,
      | 'primaryCtaLabel'
      | 'primaryCtaHref'
      | 'secondaryCtaLabel'
      | 'secondaryCtaHref'
      | 'tertiaryCtaLabel'
      | 'tertiaryCtaHref'
      | 'quaternaryCtaLabel'
      | 'quaternaryCtaHref'
    >
  >
} = {
  season: '2025-2026 Season',
  headline: 'Friday Night Lights',
  heroDescription:
    'Home of the Westfield Eagles. Building champions on and off the field since 1952.',
  background: {
    src: '/images/hero-football-v2.svg',
    alt: 'Westfield Eagles football team celebrating under Friday night lights',
  },
  ctas: {
    primaryCtaLabel: 'View Schedule',
    primaryCtaHref: '/schedule',
    secondaryCtaLabel: 'Season Highlights',
    secondaryCtaHref: '/news',
    tertiaryCtaLabel: 'View Roster',
    tertiaryCtaHref: '/roster',
    quaternaryCtaLabel: 'View Results',
    quaternaryCtaHref: '/results',
  },
}

/* ============================================================
   Helpers
============================================================ */

/**
 * pick()
 * - Safely picks a value from Payload (which may be null/undefined)
 * - Falls back to a default if missing
 */
function pick<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback
}

/**
 * resolveHeroBackground()
 * Goal:
 * - Convert Payload's file info into the `HeroBackground` { src, alt }
 *
 * Important behavior:
 * - Prefer `/media/<filename>` (works great with Payload static media)
 * - If Payload gives `/cms-api/media/file/...`, transform it to `/media/...`
 */
function resolveHeroBackground(bg?: HeroSettings['backgroundImage']): HeroBackground {
  const fallback = DEFAULT_HERO.background
  if (!bg) return fallback

  // Best case: filename is present => we can use /media/<filename>
  if (bg.filename) {
    return {
      src: `/media/${bg.filename}`,
      alt: pick(bg.alt, fallback.alt),
    }
  }

  // Otherwise use the URL if provided
  const url = bg.url ?? undefined
  if (!url) return fallback

  // Normalize absolute URLs into a pathname (or accept relative paths)
  let pathname: string | undefined
  try {
    pathname = new URL(url).pathname
  } catch {
    pathname = url.startsWith('/') ? url : undefined
  }
  if (!pathname) return fallback

  // Convert /cms-api/media/file/<name> => /media/<name>
  const src = pathname.replace(/^\/cms-api\/media\/file\//, '/media/')

  return {
    src,
    alt: pick(bg.alt, fallback.alt),
  }
}

/* ============================================================
   Payload access
   - Reads the "hero-settings" Global from Payload
   - Normalizes values into our HeroSettings type
============================================================ */
async function getHeroSettings(): Promise<HeroSettings> {
  try {
    const payload = await getPayload({ config: configPromise })
    const raw = (await payload.findGlobal({ slug: 'hero-settings', depth: 1 })) as any

    const bg =
      raw?.backgroundImage && typeof raw.backgroundImage === 'object'
        ? {
            url: raw.backgroundImage.url ?? null,
            alt: raw.backgroundImage.alt ?? null,
            filename: raw.backgroundImage.filename ?? null,
          }
        : null

    return {
      season: raw?.season ?? null,
      headline: raw?.headline ?? null,
      heroDescription: raw?.heroDescription ?? null,
      backgroundImage: bg,

      primaryCtaLabel: raw?.primaryCtaLabel ?? null,
      primaryCtaHref: raw?.primaryCtaHref ?? null,
      secondaryCtaLabel: raw?.secondaryCtaLabel ?? null,
      secondaryCtaHref: raw?.secondaryCtaHref ?? null,
      tertiaryCtaLabel: raw?.tertiaryCtaLabel ?? null,
      tertiaryCtaHref: raw?.tertiaryCtaHref ?? null,
      quaternaryCtaLabel: raw?.quaternaryCtaLabel ?? null,
      quaternaryCtaHref: raw?.quaternaryCtaHref ?? null,
    }
  } catch {
    // If Payload isn't reachable yet, fall back gracefully
    return {}
  }
}

/* ============================================================
   Layout builder
   - Returns CMS layout JSON for a given path
   - For "/", injects HeroSection fields using Payload global values
============================================================ */
async function layoutForPath(path: string): Promise<CmsLayoutData> {
  const routeName = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-')
  const f = <T>(value: T): Field<T> => ({ value })

  // Demo “mock CMS” content
  const title = (() => {
    if (path === '/') return 'Hello from a Mock Layout Service'
    if (path === '/about') return 'About this sandbox'
    if (path === '/tickets') return 'Tickets (demo page)'
    return `Hello from ${path} (mock layout)`
  })()

  const text = (() => {
    if (path === '/') {
      return 'This page is rendered from CMS-style layout JSON. Next step: swap this mock endpoint for your real CMS backend.'
    }
    if (path === '/about') {
      return 'This is a basic About page rendered through the catch-all route. The URL (/about) is “real”, and the content comes from layout JSON (mocking what a CMS would return).'
    }
    if (path === '/tickets') {
      return 'Another route driven by layout JSON. In a real CMS, authors could add/remove components in placeholders without code changes.'
    }
    return 'In a real setup, this layout JSON comes from your CMS and is editable by authors.'
  })()

  // Navbar is always present in your examples
  const navbar = (): ComponentRendering => ({
    uid: 'navbar',
    componentName: 'Navbar',
    fields: {
      brandName: f('Westfield Eagles'),
      brandSubtitle: f('Football'),
      brandMark: f('W'),
      navLinks: f([
        { label: 'Schedule', href: '/schedule' },
        { label: 'Roster', href: '/roster' },
        { label: 'Results', href: '/results' },
        { label: 'News', href: '/news' },
        { label: 'Contact', href: '/contact' },
      ]),
      fourthAndOneLabel: f('4th&1'),
      fourthAndOneHref: f('/fourth-and-1'),
      fourthAndOneLogo: f({
        src: '/images/logo-4th-and-1-v2.svg',
        alt: '4th&1 logo',
        width: 24,
        height: 24,
      }),
    },
  })

  // Pull hero values from Payload
  const hero = await getHeroSettings()
  const heroBackground = resolveHeroBackground(hero.backgroundImage)

  const main: ComponentRendering[] = (() => {
    // Home route: inject hero fields dynamically
    if (path === '/') {
      return [
        navbar(),
        {
          uid: 'hero-section',
          componentName: 'HeroSection',
          fields: {
            season: f(pick(hero.season, DEFAULT_HERO.season)),
            headline: f(pick(hero.headline, DEFAULT_HERO.headline)),
            heroDescription: f(pick(hero.heroDescription, DEFAULT_HERO.heroDescription)),
            backgroundImage: f(heroBackground),
            primaryCtaLabel: f(pick(hero.primaryCtaLabel, DEFAULT_HERO.ctas.primaryCtaLabel)),
            primaryCtaHref: f(pick(hero.primaryCtaHref, DEFAULT_HERO.ctas.primaryCtaHref)),
            secondaryCtaLabel: f(pick(hero.secondaryCtaLabel, DEFAULT_HERO.ctas.secondaryCtaLabel)),
            secondaryCtaHref: f(pick(hero.secondaryCtaHref, DEFAULT_HERO.ctas.secondaryCtaHref)),
            tertiaryCtaLabel: f(pick(hero.tertiaryCtaLabel, DEFAULT_HERO.ctas.tertiaryCtaLabel)),
            tertiaryCtaHref: f(pick(hero.tertiaryCtaHref, DEFAULT_HERO.ctas.tertiaryCtaHref)),
            quaternaryCtaLabel: f(pick(hero.quaternaryCtaLabel, DEFAULT_HERO.ctas.quaternaryCtaLabel)),
            quaternaryCtaHref: f(pick(hero.quaternaryCtaHref, DEFAULT_HERO.ctas.quaternaryCtaHref)),
          },
        },
        { uid: 'stats-bar', componentName: 'StatsBar' },
        { uid: 'schedule-section', componentName: 'ScheduleSection' },
        { uid: 'roster-spotlight', componentName: 'RosterSpotlight' },
        { uid: 'news-section', componentName: 'NewsSection' },
        { uid: 'contact-section', componentName: 'ContactSection' },
        { uid: 'footer', componentName: 'Footer' },
      ]
    }

    // Everything else = your existing mock routes
    if (path === '/fourth-and-1') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        {
          uid: 'fourth-and-1',
          componentName: 'FourthAndOne',
          fields: {
            logo: f({
              src: '/images/logo-4th-and-1-v2.svg',
              alt: '4th&1 logo',
              width: 174,
              height: 240,
            }),
            tagline: f('When it matters most, we convert.'),
            teamName: f('Westfield Eagles'),
          },
        },
        { uid: 'footer', componentName: 'Footer' },
      ]
    }

    if (path === '/schedule') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'schedule-section', componentName: 'ScheduleSection' },
        { uid: 'footer', componentName: 'Footer' },
      ]
    }

    if (path === '/roster') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'roster-spotlight', componentName: 'RosterSpotlight' },
        { uid: 'footer', componentName: 'Footer' },
      ]
    }

    if (path === '/results') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'results-section', componentName: 'ResultsSection' },
        { uid: 'footer', componentName: 'Footer' },
      ]
    }

    if (path === '/news') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'news-section', componentName: 'NewsSection' },
        { uid: 'footer', componentName: 'Footer' },
      ]
    }

    if (path === '/contact') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'contact-section', componentName: 'ContactSection' },
        { uid: 'footer', componentName: 'Footer' },
      ]
    }

    // About / fallback “core”
    const core: ComponentRendering[] =
      path === '/about'
        ? [
            {
              uid: `hero-${routeName}`,
              componentName: 'Hero',
              fields: { title: f(title), text: f(text) },
            },
            {
              uid: `promo-${routeName}`,
              componentName: 'PromoCard',
              fields: {
                headline: f('This component is also React'),
                body: f(
                  'We did not create an about.tsx page. We added this component to the layout JSON for /about, and Next.js rendered it server-side by mapping componentName → a real React component.',
                ),
                ctaText: f('View tickets'),
                ctaHref: f('/tickets'),
              },
            },
            {
              uid: 'featurelist-about',
              componentName: 'FeatureList',
              fields: {
                title: { value: 'Why headless?' },
                items: { value: ['Authors manage content', 'Next.js renders UI', 'SSR for SEO/perf'] },
              },
            },
          ]
        : [
            {
              uid: `hero-${routeName}`,
              componentName: 'Hero',
              fields: { title: f(title), text: f(text) },
            },
          ]

    return [
      navbar(),
      { uid: 'nav-spacer', componentName: 'NavSpacer' },
      ...core,
      { uid: 'footer', componentName: 'Footer' },
    ]
  })()

  return {
    cms: {
      context: { language: 'en' },
      route: { name: routeName, placeholders: { main } },
    },
  }
}

/* ============================================================
   API route: GET /api/layout?path=/some-route
   - Validates the path
   - Blocks unknown routes (returns "route: null")
   - Adds theme to cms.context
   - Returns the layout JSON
============================================================ */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const path = url.searchParams.get('path')

  if (!path || !path.startsWith('/')) {
    return NextResponse.json(
      { error: 'Query string "path" must be a string starting with "/".' },
      { status: 400 },
    )
  }

  const allowed = new Set([
    '/',
    '/about',
    '/tickets',
    '/fourth-and-1',
    '/schedule',
    '/roster',
    '/results',
    '/news',
    '/contact',
  ])

  if (!allowed.has(path)) {
    const notFound: CmsLayoutData = { cms: { context: {}, route: null } }
    return NextResponse.json(notFound)
  }

  const theme = await getThemeConfig()
  const layout = await layoutForPath(path)
  layout.cms.context = { ...layout.cms.context, theme }

  return NextResponse.json(layout)
}
