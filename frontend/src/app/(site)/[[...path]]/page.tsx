import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { CmsLayoutData } from '@/lib/types/cms';
import Placeholder from '@/lib/utils/Placeholder';
import { fetchLayoutData } from '@/lib/services/layout';
import { ThemeTokensEffect } from '@/lib/theme/ThemeTokensEffect';
import type { ThemeConfig } from "@/lib/theme/types";
import { buildThemeStyle } from '@/lib/theme/buildThemeStyle';
import { getSiteMetadata } from '@/lib/services/metadata';

type PageProps = {
  params: Promise<{ path?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { path: segments = [] } = await params;
  const path = `/${segments.join('/')}`.replace(/\/$/, '') || '/';
  const pageTitle = segments.length ? segments[segments.length - 1] ?? '' : 'Home';
  const metadata = await getSiteMetadata(path);
  const formattedTitle = pageTitle
    ? `${pageTitle.replace(/-/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase())}`
    : 'Home';

  return {
    title: `${formattedTitle} | ${metadata.titleSuffix}`,
    description: metadata.description,
  };
}

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

