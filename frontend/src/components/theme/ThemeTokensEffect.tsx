"use client";

import * as React from 'react';
import { useAtomValue } from 'jotai';
import { themeModeAtom } from '@/state/atoms';

export type ThemeTokens = {
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  muted?: string;
  mutedForeground?: string;
  accent?: string;
  accentForeground?: string;
  destructive?: string;
  destructiveForeground?: string;
  border?: string;
  input?: string;
  ring?: string;
  radius?: string;
};

export type ThemeConfig = {
  light?: ThemeTokens;
  dark?: ThemeTokens;
};

type ThemeTokensEffectProps = {
  theme?: ThemeConfig | null;
};

export function ThemeTokensEffect({ theme }: ThemeTokensEffectProps) {
  const mode = useAtomValue(themeModeAtom);

  React.useEffect(() => {
    if (!theme) return;

    const tokens = mode === 'dark' ? theme.dark : theme.light;
    if (!tokens) return;

    const root = document.documentElement;

    if (tokens.background) root.style.setProperty('--background', tokens.background);
    if (tokens.foreground) root.style.setProperty('--foreground', tokens.foreground);
    if (tokens.card) root.style.setProperty('--card', tokens.card);
    if (tokens.cardForeground) root.style.setProperty('--card-foreground', tokens.cardForeground);
    if (tokens.popover) root.style.setProperty('--popover', tokens.popover);
    if (tokens.popoverForeground) root.style.setProperty('--popover-foreground', tokens.popoverForeground);
    if (tokens.primary) root.style.setProperty('--primary', tokens.primary);
    if (tokens.primaryForeground) root.style.setProperty('--primary-foreground', tokens.primaryForeground);
    if (tokens.secondary) root.style.setProperty('--secondary', tokens.secondary);
    if (tokens.secondaryForeground) root.style.setProperty('--secondary-foreground', tokens.secondaryForeground);
    if (tokens.muted) root.style.setProperty('--muted', tokens.muted);
    if (tokens.mutedForeground) root.style.setProperty('--muted-foreground', tokens.mutedForeground);
    if (tokens.accent) root.style.setProperty('--accent', tokens.accent);
    if (tokens.accentForeground) root.style.setProperty('--accent-foreground', tokens.accentForeground);
    if (tokens.destructive) root.style.setProperty('--destructive', tokens.destructive);
    if (tokens.destructiveForeground) root.style.setProperty('--destructive-foreground', tokens.destructiveForeground);
    if (tokens.border) root.style.setProperty('--border', tokens.border);
    if (tokens.input) root.style.setProperty('--input', tokens.input);
    if (tokens.ring) root.style.setProperty('--ring', tokens.ring);
    if (tokens.radius) root.style.setProperty('--radius', tokens.radius);
  }, [mode, theme]);

  return null;
}
