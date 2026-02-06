import type { NextApiRequest, NextApiResponse } from 'next';
import type { CmsLayoutData, ComponentRendering, Field } from '@/lib/types/cms';

function layoutForPath(path: string): CmsLayoutData {
  const routeName = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-');

  const f = <T,>(value: T): Field<T> => ({ value });

  const title = (() => {
    if (path === '/') return 'Hello from a Mock Layout Service';
    if (path === '/about') return 'About this sandbox';
    if (path === '/tickets') return 'Tickets (demo page)';
    return `Hello from ${path} (mock layout)`;
  })();

  const text = (() => {
    if (path === '/') {
      return 'This page is rendered from CMS-style layout JSON. Next step: swap this mock endpoint for your real CMS backend.';
    }
    if (path === '/about') {
      return 'This is a basic About page rendered through the catch-all route. The URL (/about) is “real”, and the content comes from layout JSON (mocking what a CMS would return).';
    }
    if (path === '/tickets') {
      return 'Another route driven by layout JSON. In a real CMS, authors could add/remove components in placeholders without code changes.';
    }
    return 'In a real setup, this layout JSON comes from your CMS and is editable by authors.';
  })();

  const main: ComponentRendering[] = (() => {
    // v0-style home page (one-page sections)
    if (path === '/') {
      return [
        { uid: 'navbar', componentName: 'Navbar' },
        { uid: 'hero-section', componentName: 'HeroSection' },
        { uid: 'stats-bar', componentName: 'StatsBar' },
        { uid: 'schedule-section', componentName: 'ScheduleSection' },
        { uid: 'roster-spotlight', componentName: 'RosterSpotlight' },
        { uid: 'news-section', componentName: 'NewsSection' },
        { uid: 'contact-section', componentName: 'ContactSection' },
        { uid: 'footer', componentName: 'Footer' },
      ];
    }

    // v0-style 4th&1 page
    if (path === '/fourth-and-1') {
      return [
        { uid: 'navbar', componentName: 'Navbar' },
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'fourth-and-1', componentName: 'FourthAndOne' },
        { uid: 'footer', componentName: 'Footer' },
      ];
    }

    if (path === '/schedule') {
      return [
        { uid: 'navbar', componentName: 'Navbar' },
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'schedule-section', componentName: 'ScheduleSection' },
        { uid: 'footer', componentName: 'Footer' },
      ];
    }

    if (path === '/roster') {
      return [
        { uid: 'navbar', componentName: 'Navbar' },
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'roster-spotlight', componentName: 'RosterSpotlight' },
        { uid: 'footer', componentName: 'Footer' },
      ];
    }

    if (path === '/results') {
      return [
        { uid: 'navbar', componentName: 'Navbar' },
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'results-section', componentName: 'ResultsSection' },
        { uid: 'footer', componentName: 'Footer' },
      ];
    }

    if (path === '/news') {
      return [
        { uid: 'navbar', componentName: 'Navbar' },
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'news-section', componentName: 'NewsSection' },
        { uid: 'footer', componentName: 'Footer' },
      ];
    }

    if (path === '/contact') {
      return [
        { uid: 'navbar', componentName: 'Navbar' },
        { uid: 'nav-spacer', componentName: 'NavSpacer' },
        { uid: 'contact-section', componentName: 'ContactSection' },
        { uid: 'footer', componentName: 'Footer' },
      ];
    }

    // Default: keep the existing demo components, but wrap them with the v0 navbar/footer.
    const core: ComponentRendering[] =
      path === '/about'
        ? [
            {
              uid: `hero-${routeName}`,
              componentName: 'Hero',
              fields: {
                title: f(title),
                text: f(text),
              },
            },
            {
              uid: `promo-${routeName}`,
              componentName: 'PromoCard',
              fields: {
                headline: f('This component is also React'),
                body: f(
                  'We did not create an about.tsx page. We added this component to the layout JSON for /about, and Next.js rendered it server-side by mapping componentName → a real React component.'
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
              fields: {
                title: f(title),
                text: f(text),
              },
            },
          ];

    return [{ uid: 'navbar', componentName: 'Navbar' }, { uid: 'nav-spacer', componentName: 'NavSpacer' }, ...core, { uid: 'footer', componentName: 'Footer' }];
  })();

  return {
    cms: {
      context: {
        language: 'en',
      },
      route: {
        name: routeName,
        placeholders: {
          main,
        },
      },
    },
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathParam = req.query.path;
  const path = Array.isArray(pathParam) ? pathParam[0] : pathParam;

  if (!path || typeof path !== 'string' || !path.startsWith('/')) {
    res.status(400).json({ error: 'Query string "path" must be a string starting with "/".' });
    return;
  }

  // Small demo: pretend only a few routes exist.
  const allowed = new Set(['/', '/about', '/tickets', '/fourth-and-1', '/schedule', '/roster', '/results', '/news', '/contact']);
  if (!allowed.has(path)) {
    const notFound: CmsLayoutData = { cms: { context: {}, route: null } };
    res.status(200).json(notFound);
    return;
  }

  res.status(200).json(layoutForPath(path));
}
