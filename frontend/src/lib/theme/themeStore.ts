import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ThemeConfig } from '@/lib/theme/ThemeTokensEffect';

const themePath = path.join(process.cwd(), 'data', 'theme.json');

export async function getThemeConfig(): Promise<ThemeConfig> {
  const raw = await fs.readFile(themePath, 'utf-8');
  return JSON.parse(raw) as ThemeConfig;
}

export async function saveThemeConfig(theme: ThemeConfig): Promise<void> {
  const dir = path.dirname(themePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(themePath, JSON.stringify(theme, null, 2));
}
