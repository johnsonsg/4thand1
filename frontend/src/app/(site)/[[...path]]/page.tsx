import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { CmsLayoutData } from '@/lib/types/cms';
import Placeholder from '@/lib/utils/Placeholder';
import { fetchLayoutData } from '@/lib/services/layout';
import { ThemeTokensEffect, type ThemeConfig } from '@/lib/theme/ThemeTokensEffect';
import { buildThemeStyle } from '@/lib/theme/buildThemeStyle';

type PageProps = {
  params: Promise<{ path?: string[] }>;
};

export default async function RoutePage({ params }: PageProps) {
  const { path: segments = [] } = await params;
  const path = `/${segments.join('/')}`.replace(/\/$/, '') || '/';

  const reqHeaders = await headers();
  const layoutData = (await fetchLayoutData({ path, headers: reqHeaders })) as CmsLayoutData;

  if (!layoutData?.cms?.route) {
    notFound();
  }

  const route = layoutData.cms.route;
  const theme = (layoutData.cms.context?.theme ?? null) as ThemeConfig | null;
  const themeStyle = buildThemeStyle(theme);

  return (
    <main>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Placeholder name="main" rendering={route} />
    </main>
  );
}

