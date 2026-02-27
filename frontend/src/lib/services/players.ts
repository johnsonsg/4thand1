import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { headers } from 'next/headers';

import type { Player, PositionGroup } from '@/lib/players';
import { resolveTenantFromHeaders } from '@/lib/tenancy/resolveTenant';

type MediaLike = {
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
};

type PlayerEntry = {
  id?: string | null;
  slug?: string | null;
  name?: string | null;
  number?: string | null;
  position?: string | null;
  positionGroup?: Player['positionGroup'] | string | null;
  spotlight?: boolean | null;
  year?: string | null;
  height?: string | null;
  weight?: string | null;
  image?: MediaLike | string | null;
  stats?: string | null;
  hudlUrl?: string | null;
  bio?: string | null;
  accolades?: Array<{ title?: string | null }> | null;
  sortOrder?: number | null;
  headshotProcessedKey?: string | null;
  headshotStatus?: 'none' | 'queued' | 'processing' | 'processed' | 'failed' | null;
};

type TenantSettingsDoc = {
  id: string;
  tenantId?: string | null;
  players?: PlayerEntry[] | null;
};

const B2_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_B2_PUBLIC_BASE_URL ?? 'https://4thand1.s3.us-east-005.backblazeb2.com';

  const resolvePlayerHeadshotUrl = (entry: PlayerEntry): string => {
  if (entry.headshotStatus === 'processed' && entry.headshotProcessedKey) {
    return `${B2_PUBLIC_BASE_URL}/${entry.headshotProcessedKey}`;
  }
  return resolvePlayerImage(entry.image);
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

const resolvePlayerImage = (value?: MediaLike | string | null): string => {
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

const isPositionGroup = (value: string): value is PositionGroup =>
  value === 'Offense' || value === 'Defense' || value === 'Special Teams';

const normalizePositionGroups = (value?: PlayerEntry['positionGroup']): PositionGroup[] => {
  if (Array.isArray(value)) {
    return value.filter(isPositionGroup);
  }
  if (typeof value === 'string' && isPositionGroup(value)) {
    return [value];
  }
  return ['Offense'];
};

const mapPlayer = (entry: PlayerEntry): Player => {
  const name = entry.name ?? 'Unknown Player';
  const number = entry.number ?? '';
  const slugBase = [name, number].filter(Boolean).join('-');
  const fallbackSlug = slugBase ? slugify(slugBase) : undefined;
  const id = entry.slug ?? entry.id ?? fallbackSlug ?? '';

  return {
    id,
    name,
    number,
    position: entry.position ?? '',
    positionGroup: normalizePositionGroups(entry.positionGroup),
    spotlight: Boolean(entry.spotlight),
    year: entry.year ?? '',
    height: entry.height ?? '',
    weight: entry.weight ?? '',
    // image: resolvePlayerImage(entry.image), // using local storage
    image: resolvePlayerHeadshotUrl(entry), // using backblaze
    stats: entry.stats ?? '',
    hudlUrl: entry.hudlUrl ?? undefined,
    bio: entry.bio ?? '',
    accolades: (entry.accolades ?? []).map((item) => item.title ?? '').filter(Boolean),
  };
};

const getTenantPlayers = async (): Promise<PlayerEntry[]> => {
  const payload = await getPayload({ config: configPromise });
  const tenantId = await resolveTenantId();
  const result = await payload.find({
    collection: 'tenant-settings',
    depth: 2,
    limit: 1,
    where: { tenantId: { equals: tenantId } },
  });
  const doc = (result?.docs?.[0] as TenantSettingsDoc | undefined) ?? undefined;
  return (doc?.players ?? []) as PlayerEntry[];
};

export async function getPlayers(): Promise<Player[]> {
  try {
    const entries = await getTenantPlayers();
    if (!entries.length) return [];

    return entries
      .slice()
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(mapPlayer);
  } catch {
    return [];
  }
}

export async function getPlayerBySlug(slug: string): Promise<Player | undefined> {
  try {
    const entries = await getTenantPlayers();
    const match = entries.find((entry) => entry.slug === slug || entry.id === slug);
    return match ? mapPlayer(match) : undefined;
  } catch {
    return undefined;
  }
}

export async function getPlayerSlugs(): Promise<string[]> {
  try {
    const entries = await getTenantPlayers();
    return entries
      .map((entry) => entry.slug ?? entry.id ?? '')
      .filter((slug): slug is string => Boolean(slug));
  } catch {
    return [];
  }
}
