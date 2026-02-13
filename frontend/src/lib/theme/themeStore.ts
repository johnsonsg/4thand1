import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ThemeConfig } from '@/lib/theme/ThemeTokensEffect';

const defaultThemePath = path.join(process.cwd(), 'data', 'theme.json');

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function tenantThemePath(tenantId: string) {
  return path.join(process.cwd(), 'data', 'themes', `${tenantId}.json`);
}

export async function getThemeConfig(tenantId?: string): Promise<ThemeConfig> {
  if (tenantId) {
    const themedPath = tenantThemePath(tenantId);
    if (await fileExists(themedPath)) {
      const raw = await fs.readFile(themedPath, 'utf-8');
      return JSON.parse(raw) as ThemeConfig;
    }
  }

  const raw = await fs.readFile(defaultThemePath, 'utf-8');
  return JSON.parse(raw) as ThemeConfig;
}

export async function saveThemeConfig(theme: ThemeConfig, tenantId?: string): Promise<void> {
  const targetPath = tenantId ? tenantThemePath(tenantId) : defaultThemePath;
  const dir = path.dirname(targetPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(targetPath, JSON.stringify(theme, null, 2));
}
