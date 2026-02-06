import type { GetServerSidePropsContext } from 'next';
import type { CmsLayoutData } from '@/lib/types/cms';

type FetchLayoutArgs = {
  path: string;
  context: Pick<GetServerSidePropsContext, 'req'>;
};

function getBaseUrl(req: GetServerSidePropsContext['req']) {
  const proto = (req.headers['x-forwarded-proto'] as string | undefined) ?? 'http';
  const host = req.headers.host;
  return `${proto}://${host}`;
}

/**
 * CMS layout fetcher.
 *
 * Modes (set `CMS_MODE`):
 * - `mock` (default): calls this app's `/api/layout`.
 * - `custom`: calls your backend's layout endpoint (`CMS_LAYOUT_URL`).
 */
export async function fetchLayoutData({ path, context }: FetchLayoutArgs): Promise<CmsLayoutData> {
  const mode = (process.env.CMS_MODE ?? 'mock').toLowerCase();

  if (mode === 'mock') {
    const baseUrl = getBaseUrl(context.req);
    const res = await fetch(`${baseUrl}/api/layout?path=${encodeURIComponent(path)}`);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Mock CMS layout request failed (${res.status}): ${body.slice(0, 500)}`);
    }
    return (await res.json()) as CmsLayoutData;
  }

  if (mode === 'custom') {
    const layoutUrl = process.env.CMS_LAYOUT_URL;
    if (!layoutUrl) {
      throw new Error('CMS_LAYOUT_URL is required when CMS_MODE=custom');
    }

    const url = new URL(layoutUrl);
    url.searchParams.set('path', path);

    const res = await fetch(url.toString(), { headers: { accept: 'application/json' } });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Custom CMS layout request failed (${res.status}): ${body.slice(0, 500)}`);
    }

    return (await res.json()) as CmsLayoutData;
  }

  throw new Error(`Unknown CMS_MODE: ${mode}. Expected "mock" or "custom".`);
}
