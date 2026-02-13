import configPromise from '@payload-config';
import { getPayload } from 'payload';

import type { Player, PositionGroup } from '@/lib/players';
import { players as fallbackPlayers } from '@/lib/players';

type MediaLike = {
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
};

type PlayerDoc = {
  id: string;
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
};

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

const normalizePositionGroups = (value?: PlayerDoc['positionGroup']): PositionGroup[] => {
  if (Array.isArray(value)) {
    return value.filter(isPositionGroup);
  }
  if (typeof value === 'string' && isPositionGroup(value)) {
    return [value];
  }
  return ['Offense'];
};

const mapPlayer = (doc: PlayerDoc): Player => ({
  id: doc.slug ?? doc.id,
  name: doc.name ?? 'Unknown Player',
  number: doc.number ?? '',
  position: doc.position ?? '',
  positionGroup: normalizePositionGroups(doc.positionGroup),
  spotlight: Boolean(doc.spotlight),
  year: doc.year ?? '',
  height: doc.height ?? '',
  weight: doc.weight ?? '',
  image: resolvePlayerImage(doc.image),
  stats: doc.stats ?? '',
  hudlUrl: doc.hudlUrl ?? undefined,
  bio: doc.bio ?? '',
  accolades: (doc.accolades ?? []).map((item) => item.title ?? '').filter(Boolean),
});

export async function getPlayers(): Promise<Player[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'players',
      depth: 1,
      limit: 200,
      sort: 'sortOrder',
    });

    const docs = (result?.docs as PlayerDoc[]) ?? [];
    if (!docs.length) return fallbackPlayers;

    return docs.map(mapPlayer);
  } catch {
    return fallbackPlayers;
  }
}

export async function getPlayerBySlug(slug: string): Promise<Player | undefined> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'players',
      depth: 1,
      limit: 1,
      where: { slug: { equals: slug } },
    });
    const doc = (result?.docs?.[0] as PlayerDoc | undefined) ?? undefined;
    return doc ? mapPlayer(doc) : fallbackPlayers.find((player) => player.id === slug);
  } catch {
    return fallbackPlayers.find((player) => player.id === slug);
  }
}

export async function getPlayerSlugs(): Promise<string[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'players',
      depth: 0,
      limit: 200,
    });
    const docs = (result?.docs as PlayerDoc[]) ?? [];
    if (!docs.length) return fallbackPlayers.map((player) => player.id);

    return docs
      .map((doc) => doc.slug ?? doc.id)
      .filter((slug): slug is string => Boolean(slug));
  } catch {
    return fallbackPlayers.map((player) => player.id);
  }
}
