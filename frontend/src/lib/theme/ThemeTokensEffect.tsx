"use client";

import * as React from "react";
import { useAtomValue } from "jotai";
import { themeModeAtom } from "@/state/atoms";
import { normalizeThemeToken } from "@/lib/theme/normalizeThemeToken";
import type { ThemeConfig } from "@/lib/theme/types";

type ThemeTokensEffectProps = {
  theme?: ThemeConfig | null;
};

export function ThemeTokensEffect({ theme }: ThemeTokensEffectProps) {
  const mode = useAtomValue(themeModeAtom);

  React.useEffect(() => {
    const root = document.documentElement;
    const headshotBg = theme?.headshots?.backgroundColor;

    if (headshotBg) {
      root.style.setProperty("--headshot-bg", normalizeThemeToken(headshotBg));
    }

    if (!theme) return;

    const tokens = mode === "dark" ? theme.dark : theme.light;
    if (!tokens) return;

    // existing tokens
    if (tokens.background) root.style.setProperty("--background", normalizeThemeToken(tokens.background));
    if (tokens.foreground) root.style.setProperty("--foreground", normalizeThemeToken(tokens.foreground));
    if (tokens.card) root.style.setProperty("--card", normalizeThemeToken(tokens.card));
    if (tokens.cardForeground) root.style.setProperty("--card-foreground", normalizeThemeToken(tokens.cardForeground));
    if (tokens.popover) root.style.setProperty("--popover", normalizeThemeToken(tokens.popover));
    if (tokens.popoverForeground) root.style.setProperty("--popover-foreground", normalizeThemeToken(tokens.popoverForeground));
    if (tokens.primary) root.style.setProperty("--primary", normalizeThemeToken(tokens.primary));
    if (tokens.primaryForeground) root.style.setProperty("--primary-foreground", normalizeThemeToken(tokens.primaryForeground));
    if (tokens.secondary) root.style.setProperty("--secondary", normalizeThemeToken(tokens.secondary));
    if (tokens.secondaryForeground) root.style.setProperty("--secondary-foreground", normalizeThemeToken(tokens.secondaryForeground));
    if (tokens.muted) root.style.setProperty("--muted", normalizeThemeToken(tokens.muted));
    if (tokens.mutedForeground) root.style.setProperty("--muted-foreground", normalizeThemeToken(tokens.mutedForeground));
    if (tokens.accent) root.style.setProperty("--accent", normalizeThemeToken(tokens.accent));
    if (tokens.accentForeground) root.style.setProperty("--accent-foreground", normalizeThemeToken(tokens.accentForeground));
    if (tokens.destructive) root.style.setProperty("--destructive", normalizeThemeToken(tokens.destructive));
    if (tokens.destructiveForeground) root.style.setProperty("--destructive-foreground", normalizeThemeToken(tokens.destructiveForeground));
    if (tokens.border) root.style.setProperty("--border", normalizeThemeToken(tokens.border));
    if (tokens.input) root.style.setProperty("--input", normalizeThemeToken(tokens.input));
    if (tokens.ring) root.style.setProperty("--ring", normalizeThemeToken(tokens.ring));
    if (tokens.radius) root.style.setProperty("--radius", tokens.radius);
  }, [mode, theme]);

  return null;
}