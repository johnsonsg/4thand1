import type { CmsLayoutData } from '@/lib/types/cms';

type FetchLayoutArgs = {
  path: string;
  context?: { req: { headers: Record<string, string | string[] | undefined> } };
  headers?: Headers;
};

type HeaderGetter = { get(name: string): string | null };

function getBaseUrlFromHeaders(headers: HeaderGetter) {
  const proto = headers.get('x-forwarded-proto') ?? 'http';
  const host = headers.get('x-forwarded-host') ?? headers.get('host');
  if (!host) throw new Error('Missing host header for CMS layout request.');
  return `${proto}://${host}`;
}

function getBaseUrlFromReq(req: { headers: Record<string, string | string[] | undefined> }) {
  const rawProto = req.headers['x-forwarded-proto'];
  const proto = Array.isArray(rawProto) ? rawProto[0] : rawProto ?? 'http';
  const rawHost = req.headers['x-forwarded-host'] ?? req.headers.host;
  const host = Array.isArray(rawHost) ? rawHost[0] : rawHost;
  if (!host) throw new Error('Missing host header for CMS layout request.');
  return `${proto}://${host}`;
}

/**
 * CMS layout fetcher.
 *
 * Modes (set `CMS_MODE`):
 * - `mock` (default): calls this app's `/api/layout`.
 * - `custom`: calls your backend's layout endpoint (`CMS_LAYOUT_URL`).
 */
export async function fetchLayoutData({ path, context, headers }: FetchLayoutArgs): Promise<CmsLayoutData> {
  const mode = (process.env.CMS_MODE ?? 'mock').toLowerCase();

  if (mode === 'mock') {
    let baseUrl: string;
    if (headers) {
      baseUrl = getBaseUrlFromHeaders(headers);
    } else if (context?.req) {
      baseUrl = getBaseUrlFromReq(context.req);
    } else {
      throw new Error('Missing request headers for CMS layout request.');
    }
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
