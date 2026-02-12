import { headers } from 'next/headers';

import type { CmsLayoutData, ComponentRendering } from '@/lib/types/cms';
import type { ThemeConfig } from '@/lib/theme/ThemeTokensEffect';
import { fetchLayoutData } from '@/lib/services/layout';

export type SiteLayoutResult = {
  layoutData: CmsLayoutData;
  main: ComponentRendering[];
  navbar: ComponentRendering;
  footer: ComponentRendering;
  theme: ThemeConfig | null;
};

const fallbackNavbar: ComponentRendering = {
  componentName: 'Navbar',
  fields: {},
};

const fallbackFooter: ComponentRendering = {
  componentName: 'Footer',
  fields: {},
};

export async function getSiteLayout(path: string): Promise<SiteLayoutResult> {
  const reqHeaders = await headers();
  const layoutData = (await fetchLayoutData({ path, headers: reqHeaders })) as CmsLayoutData;
  const main = layoutData.cms.route?.placeholders?.main ?? [];
  const theme = (layoutData.cms.context?.theme ?? null) as ThemeConfig | null;

  const navbar =
    main.find((component) => component.componentName === 'Navbar') ?? fallbackNavbar;
  const footer =
    main.find((component) => component.componentName === 'Footer') ?? fallbackFooter;

  return {
    layoutData,
    main,
    navbar,
    footer,
    theme,
  };
}
