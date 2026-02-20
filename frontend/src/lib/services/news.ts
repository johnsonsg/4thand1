import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { headers } from 'next/headers';

import { resolveTenantFromHeaders } from '@/lib/tenancy/resolveTenant';
import type { Article } from '@/lib/articles';
import { articles as fallbackArticles } from '@/lib/articles';

type MediaLike = {
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
};

type NewsBodyEntry = {
  paragraph?: string | null;
};

type NewsEntry = {
  id?: string | null;
  slug?: string | null;
  title?: string | null;
  author?: string | null;
  excerpt?: string | null;
  image?: MediaLike | string | null;
  category?: string | null;
  body?: Array<NewsBodyEntry | string> | null;
  publishedAt?: string | null;
};

type TenantSettingsDoc = {
  id: string;
  tenantId?: string | null;
  news?: NewsEntry[] | null;
};

type NewsQueryOptions = {
  tenantId?: string;
  limit?: number;
};

const resolveTenantId = async (): Promise<string> => {
  const reqHeaders = await headers();
  return resolveTenantFromHeaders(reqHeaders);
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const resolveNewsImage = (value?: MediaLike | string | null): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value.filename) return `/media/${value.filename}`;
  if (value.url) {
    try {
      const pathname = new URL(value.url).pathname;
      return pathname.replace(/^\/cms-api\/media\/file\//, '/media/');
    } catch {
      return value.url;
    }
  }
  return '';
};

const formatArticleDate = (value?: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const normalizeBody = (value?: NewsEntry['body']): string[] => {
  if (!value) return [];
  return value
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      return entry?.paragraph ?? '';
    })
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const mapNewsArticle = (entry: NewsEntry): Article => {
  const title = entry.title ?? 'Untitled Article';
  const fallbackSlug = title ? slugify(title) : '';

  return {
    slug: entry.slug ?? entry.id ?? fallbackSlug,
    title,
    date: formatArticleDate(entry.publishedAt) || 'TBD',
    author: entry.author ?? 'Team Staff',
    excerpt: entry.excerpt ?? '',
    image: resolveNewsImage(entry.image) || '/images/news-1.jpg',
    category: entry.category ?? 'News',
    body: normalizeBody(entry.body),
  };
};

const getTenantNewsEntries = async ({ tenantId, limit }: NewsQueryOptions): Promise<NewsEntry[]> => {
  const payload = await getPayload({ config: configPromise });
  const resolvedTenantId = tenantId ?? (await resolveTenantId());
  const result = await payload.find({
    collection: 'tenant-settings',
    depth: 2,
    limit: 1,
    where: { tenantId: { equals: resolvedTenantId } },
  });
  const doc = (result?.docs?.[0] as TenantSettingsDoc | undefined) ?? undefined;
  const entries = (doc?.news ?? []) as NewsEntry[];
  const sorted = entries.slice().sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
};

export async function getNewsArticles(options: NewsQueryOptions = {}): Promise<Article[]> {
  try {
    const entries = await getTenantNewsEntries(options);
    if (!entries.length) return [];
    return entries.map(mapNewsArticle);
  } catch {
    return fallbackArticles;
  }
}

export async function getNewsArticleBySlug(slug: string, tenantId?: string): Promise<Article | undefined> {
  try {
    const entries = await getTenantNewsEntries({ tenantId });
    const match = entries.find((entry) => entry.slug === slug || entry.id === slug);
    return match ? mapNewsArticle(match) : fallbackArticles.find((article) => article.slug === slug);
  } catch {
    return fallbackArticles.find((article) => article.slug === slug);
  }
}

export async function getNewsSlugs(options: NewsQueryOptions = {}): Promise<string[]> {
  try {
    const entries = await getTenantNewsEntries(options);
    if (!entries.length) return [];
    return entries
      .map((entry) => entry.slug ?? entry.id ?? '')
      .filter((slug): slug is string => Boolean(slug));
  } catch {
    return fallbackArticles.map((article) => article.slug);
  }
}
