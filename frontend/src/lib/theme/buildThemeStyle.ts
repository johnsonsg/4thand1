import type { ThemeConfig, ThemeTokens } from '@/lib/theme/ThemeTokensEffect';
import { normalizeThemeToken } from '@/lib/theme/normalizeThemeToken';

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

export function buildThemeStyle(theme: ThemeConfig | null): string {
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
