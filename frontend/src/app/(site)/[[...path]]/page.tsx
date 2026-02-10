import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { CmsLayoutData } from '@/lib/types/cms';
import { Placeholder } from '@/components/rendering/Placeholder';
import { fetchLayoutData } from '@/lib/services/layout';
import { ThemeTokensEffect, type ThemeConfig, type ThemeTokens } from '@/components/theme/ThemeTokensEffect';
import { normalizeThemeToken } from '@/lib/theme/normalizeThemeToken';

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

const TOKEN_MAP: Record<keyof ThemeTokens, string> = {
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  destructive: '--destructive',
  destructiveForeground: '--destructive-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
  radius: '--radius',
};

function buildThemeStyle(theme: ThemeConfig | null): string {
  if (!theme) return '';

  const serializeTokens = (selector: string, tokens?: ThemeTokens) => {
    if (!tokens) return '';
    const lines = (Object.keys(TOKEN_MAP) as (keyof ThemeTokens)[])
      .map((key) => {
        const raw = tokens[key];
        if (!raw) return null;
        const value = key === 'radius' ? raw : normalizeThemeToken(raw);
        return `${TOKEN_MAP[key]}: ${value};`;
      })
      .filter(Boolean)
      .join('');

    return lines ? `${selector}{${lines}}` : '';
  };

  const light = serializeTokens(':root', theme.light);
  const dark = serializeTokens('html.dark', theme.dark);

  return `${light}${dark}`;
}
