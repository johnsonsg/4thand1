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
import type { ThemeConfig, ThemeTokens } from '@/lib/theme/ThemeTokensEffect'
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
  primaryCtaBackgroundColor?: string | null
  primaryCtaTextColor?: string | null

  secondaryCtaLabel?: string | null
  secondaryCtaHref?: string | null
  tertiaryCtaLabel?: string | null
  tertiaryCtaHref?: string | null
  quaternaryCtaLabel?: string | null
  quaternaryCtaHref?: string | null
}

type BrandLogo = {
  src: string
  alt: string
  width?: number
  height?: number
}

type BrandSettings = {
  brandName?: string | null
  brandSubtitle?: string | null
  brandMark?: string | null
  brandMoto?: string | null
  brandLogo?: {
    url?: string | null
    alt?: string | null
    filename?: string | null
    width?: number | null
    height?: number | null
  } | null
}

type ThemeSettings = {
  light?: ThemeTokens | null
  dark?: ThemeTokens | null
}

type StatsItem = {
  label?: string | null
  value?: string | null
}

type StatsSettings = {
  items?: StatsItem[] | null
}

type ScheduleGame = {
  dateTime?: string | null
  opponent?: string | null
  location?: string | null
  outcome?: 'W' | 'L' | 'T' | 'BYE' | null
  result?: string | null
  status?: 'final' | 'upcoming' | null
}

type ScheduleSettings = {
  seasonLabel?: string | null
  title?: string | null
  record?: string | null
  winChipBackgroundColor?: string | null
  winChipTextColor?: string | null
  games?: ScheduleGame[] | null
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

const DEFAULT_BRAND: Required<Pick<BrandSettings, 'brandName' | 'brandSubtitle' | 'brandMark'>> = {
  brandName: 'Westfield Eagles',
  brandSubtitle: 'Football',
  brandMark: 'W',
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

function resolveBrandLogo(logo?: BrandSettings['brandLogo']): BrandLogo | null {
  if (!logo) return null

  if (logo.filename) {
    return {
      src: `/media/${logo.filename}`,
      alt: logo.alt ?? 'Brand logo',
      width: logo.width ?? undefined,
      height: logo.height ?? undefined,
    }
  }

  const url = logo.url ?? undefined
  if (!url) return null

  let pathname: string | undefined
  try {
    pathname = new URL(url).pathname
  } catch {
    pathname = url.startsWith('/') ? url : undefined
  }
  if (!pathname) return null

  const src = pathname.replace(/^\/cms-api\/media\/file\//, '/media/')

  return {
    src,
    alt: logo.alt ?? 'Brand logo',
    width: logo.width ?? undefined,
    height: logo.height ?? undefined,
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
      primaryCtaBackgroundColor: raw?.primaryCtaBackgroundColor ?? null,
      primaryCtaTextColor: raw?.primaryCtaTextColor ?? null,

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

async function getBrandSettings(): Promise<BrandSettings> {
  try {
    const payload = await getPayload({ config: configPromise })
    const raw = (await payload.findGlobal({ slug: 'brand-settings', depth: 1 })) as any

    const brandLogo =
      raw?.brandLogo && typeof raw.brandLogo === 'object'
        ? {
            url: raw.brandLogo.url ?? null,
            alt: raw.brandLogo.alt ?? null,
            filename: raw.brandLogo.filename ?? null,
            width: raw.brandLogo.width ?? null,
            height: raw.brandLogo.height ?? null,
          }
        : null

    return {
      brandName: raw?.brandName ?? null,
      brandSubtitle: raw?.brandSubtitle ?? null,
      brandMark: raw?.brandMark ?? null,
      brandMoto: raw?.brandMoto ?? null,
      brandLogo,
    }
  } catch {
    return {}
  }
}

async function getThemeSettings(): Promise<ThemeConfig | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const raw = (await payload.findGlobal({ slug: 'theme-settings', depth: 0 })) as ThemeSettings

    return {
      light: raw?.light ?? undefined,
      dark: raw?.dark ?? undefined,
    }
  } catch {
    return null
  }
}

async function getStatsSettings(): Promise<StatsItem[]> {
  const defaults: StatsItem[] = [
    { label: 'Seasons', value: '73' },
    { label: 'District Titles', value: '12' },
    { label: 'State Appearances', value: '5' },
    { label: 'All-State Players', value: '48' },
  ]

  try {
    const payload = await getPayload({ config: configPromise })
    const raw = (await payload.findGlobal({ slug: 'stats-settings', depth: 0 })) as StatsSettings
    const items = raw?.items?.filter((item) => item?.label && item?.value) ?? []
    return items.length ? items.slice(0, 6) : defaults
  } catch {
    return defaults
  }
}

async function getScheduleSettings(): Promise<ScheduleSettings> {
  try {
    const payload = await getPayload({ config: configPromise })
    const raw = (await payload.findGlobal({ slug: 'schedule-settings', depth: 0 })) as ScheduleSettings

    return {
      seasonLabel: raw?.seasonLabel ?? null,
      title: raw?.title ?? null,
      record: raw?.record ?? null,
      winChipBackgroundColor: raw?.winChipBackgroundColor ?? null,
      winChipTextColor: raw?.winChipTextColor ?? null,
      games: raw?.games ?? null,
    }
  } catch {
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

  const brand = await getBrandSettings()
  const brandLogo = resolveBrandLogo(brand.brandLogo)
  const statsItems = await getStatsSettings()
  const schedule = await getScheduleSettings()

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
      brandName: f(pick(brand.brandName, DEFAULT_BRAND.brandName)),
      brandSubtitle: f(pick(brand.brandSubtitle, DEFAULT_BRAND.brandSubtitle)),
      brandMark: f(pick(brand.brandMark, DEFAULT_BRAND.brandMark)),
      ...(brandLogo ? { brandLogo: f(brandLogo) } : {}),
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
        src: '/images/logo-4th-and-1-v3.svg',
        alt: '4th&1 logo',
        width: 24,
        height: 24,
      }),
    },
  })

  const footer = (): ComponentRendering => ({
    uid: 'footer',
    componentName: 'Footer',
    fields: {
      brandName: f(pick(brand.brandName, DEFAULT_BRAND.brandName)),
      brandSubtitle: f(pick(brand.brandSubtitle, DEFAULT_BRAND.brandSubtitle)),
      brandMark: f(pick(brand.brandMark, DEFAULT_BRAND.brandMark)),
      brandMoto: f(brand.brandMoto ?? 'Building champions on and off the field since 1952.'),
      ...(brandLogo ? { brandLogo: f(brandLogo) } : {}),
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
            primaryCtaBackgroundColor: f(hero.primaryCtaBackgroundColor ?? null),
            primaryCtaTextColor: f(hero.primaryCtaTextColor ?? null),
            secondaryCtaLabel: f(pick(hero.secondaryCtaLabel, DEFAULT_HERO.ctas.secondaryCtaLabel)),
            secondaryCtaHref: f(pick(hero.secondaryCtaHref, DEFAULT_HERO.ctas.secondaryCtaHref)),
            tertiaryCtaLabel: f(pick(hero.tertiaryCtaLabel, DEFAULT_HERO.ctas.tertiaryCtaLabel)),
            tertiaryCtaHref: f(pick(hero.tertiaryCtaHref, DEFAULT_HERO.ctas.tertiaryCtaHref)),
            quaternaryCtaLabel: f(pick(hero.quaternaryCtaLabel, DEFAULT_HERO.ctas.quaternaryCtaLabel)),
            quaternaryCtaHref: f(pick(hero.quaternaryCtaHref, DEFAULT_HERO.ctas.quaternaryCtaHref)),
          },
        },
        {
          uid: 'stats-bar',
          componentName: 'StatsBar',
          fields: {
            items: f(statsItems.map((item) => ({
              label: item.label ?? '',
              value: item.value ?? '',
            }))),
          },
        },
        {
          uid: 'schedule-section',
          componentName: 'ScheduleSection',
          fields: {
            seasonLabel: f(schedule.seasonLabel ?? '2025 Season'),
            title: f(schedule.title ?? 'Game Schedule'),
            record: f(schedule.record ?? 'Record: 3-1'),
            winChipBackgroundColor: f(schedule.winChipBackgroundColor ?? null),
            winChipTextColor: f(schedule.winChipTextColor ?? null),
            ...(schedule.games?.length
              ? {
                  games: f(
                    schedule.games.map((game) => ({
                      dateTime: game.dateTime ?? '',
                      opponent: game.opponent ?? '',
                      location: game.location ?? '',
                      outcome: game.outcome ?? null,
                      result: game.result ?? null,
                      status: game.status ?? 'upcoming',
                    })),
                  ),
                }
              : {}),
          },
        },
        { uid: 'roster-spotlight', componentName: 'RosterSpotlight' },
        { uid: 'news-section', componentName: 'NewsSection' },
        { uid: 'contact-section', componentName: 'ContactSection' },
        footer(),  // Line 479: change this
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
              src: '/images/logo-4th-and-1-v3.svg',
              alt: '4th&1 logo',
              width: 174,
              height: 240,
            }),
            tagline: f('When it matters most, we convert.'),
            teamName: f('Westfield Eagles'),
          },
        },
        footer(),  // Line 497: change this
      ]
    }

    if (path === '/schedule') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        {
          uid: 'schedule-section',
          componentName: 'ScheduleSection',
          fields: {
            seasonLabel: f(schedule.seasonLabel ?? '2025 Season'),
            title: f(schedule.title ?? 'Game Schedule'),
            record: f(schedule.record ?? 'Record: 3-1'),
            winChipBackgroundColor: f(schedule.winChipBackgroundColor ?? null),
            winChipTextColor: f(schedule.winChipTextColor ?? null),
            ...(schedule.games?.length
              ? {
                  games: f(
                    schedule.games.map((game) => ({
                      dateTime: game.dateTime ?? '',
                      opponent: game.opponent ?? '',
                      location: game.location ?? '',
                      outcome: game.outcome ?? null,
                      result: game.result ?? null,
                      status: game.status ?? 'upcoming',
                    })),
                  ),
                }
              : {}),
          },
        },
        footer(),  // Line 520: change this
      ]
    }

    if (path === '/roster') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'roster-spotlight', componentName: 'RosterSpotlight' },
        footer(),  // Line 527: change this
      ]
    }

    if (path === '/results') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'results-section', componentName: 'ResultsSection' },
        footer(),  // Line 534: change this
      ]
    }

    if (path === '/news') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'news-section', componentName: 'NewsSection' },
        footer(),  // Line 541: change this
      ]
    }

    if (path === '/contact') {
      return [
        navbar(),
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'contact-section', componentName: 'ContactSection' },
        footer(),  // Line 548: change this
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
      footer(),  // Line 615-616: fix the order and use footer()
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
  const themeFromPayload = await getThemeSettings()
  const mergedTheme: ThemeConfig = {
    light: { ...theme.light, ...themeFromPayload?.light },
    dark: { ...theme.dark, ...themeFromPayload?.dark },
  }
  const layout = await layoutForPath(path)
  layout.cms.context = { ...layout.cms.context, theme: mergedTheme }

  return NextResponse.json(layout)
}
