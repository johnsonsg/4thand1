'use client';

import * as React from 'react';
import { useDocumentForm, useFormFields } from '@payloadcms/ui';
import type { Player } from '@/lib/players';

type MediaLike = {
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
  id?: string | null;
  _id?: string | null;
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
};

const isPositionGroup = (value: string): value is Player['positionGroup'][number] =>
  value === 'Offense' || value === 'Defense' || value === 'Special Teams';

const normalizePositionGroups = (value?: PlayerEntry['positionGroup']): Player['positionGroup'] => {
  if (Array.isArray(value)) {
    return value.filter(isPositionGroup);
  }
  if (typeof value === 'string' && isPositionGroup(value)) {
    return [value];
  }
  return ['Offense'];
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
  if (value.id) return String(value.id);
  if (value._id) return String(value._id);
  return '';
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

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
    image: resolvePlayerImage(entry.image),
    stats: entry.stats ?? '',
    hudlUrl: entry.hudlUrl ?? undefined,
    bio: entry.bio ?? '',
    accolades: (entry.accolades ?? []).map((item) => item.title ?? '').filter(Boolean),
  };
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export default function TenantRosterTable() {
  const { getDataByPath, dispatchFields, setModified } = useDocumentForm();
  const playersValue = useFormFields(([fields]) => fields?.players?.value as PlayerEntry[] | undefined);
  const [imageMap, setImageMap] = React.useState<Record<string, string>>({});

  const { entries, players } = React.useMemo(() => {
    const data = getDataByPath('players') as PlayerEntry[] | undefined;
    const source = Array.isArray(data) ? data : Array.isArray(playersValue) ? playersValue : [];
    const sorted = source.slice().sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
    return { entries: sorted, players: sorted.map(mapPlayer) };
  }, [getDataByPath, playersValue]);

  React.useEffect(() => {
    const ids = new Set<string>();
    for (const entry of entries) {
      const raw = resolvePlayerImage(entry.image);
      if (raw && !raw.startsWith('/') && !raw.startsWith('http')) {
        ids.add(raw);
      }
    }

    const pending = Array.from(ids).filter((id) => !imageMap[id]);
    if (!pending.length) return;

    let cancelled = false;

    const fetchMedia = async (id: string) => {
      try {
        const res = await fetch(`/cms-api/media/${id}`);
        if (!res.ok) return;
        const doc = (await res.json()) as { filename?: string; url?: string };
        const url = doc?.filename
          ? `/media/${doc.filename}`
          : doc?.url
            ? String(doc.url).replace(/^\/cms-api\/media\/file\//, '/media/')
            : '';
        if (!url || cancelled) return;
        setImageMap((prev) => ({ ...prev, [id]: url }));
      } catch {
        // ignore
      }
    };

    pending.forEach((id) => void fetchMedia(id));

    return () => {
      cancelled = true;
    };
  }, [entries, imageMap]);

  return (
    <div className="field-type">
      <h3 className="array-field__title">Team Roster</h3>
      <div className="field-type__wrap">
        {!players.length ? (
          <p className="field-type__description">Add players to see the roster table preview.</p>
        ) : (
          <div className="table" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Player', 'Position', 'Year', 'Spotlight'].map((label) => (
                    <th
                      key={label}
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderBottom: '1px solid var(--theme-elevation-150)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--theme-text-light, #9aa4b2)',
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.id} style={{ borderBottom: '1px solid var(--theme-elevation-150)' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '999px',
                            overflow: 'hidden',
                            background: 'var(--theme-elevation-100, #1f2937)',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--theme-text, #ffffff)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {(() => {
                            const raw = resolvePlayerImage(entries[index]?.image);
                            const src = raw && !raw.startsWith('/') && !raw.startsWith('http')
                              ? imageMap[raw]
                              : raw;
                            return src ? (
                            <img
                              src={src}
                              alt={player.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                            />
                            ) : (
                            <span>{getInitials(player.name)}</span>
                            );
                          })()}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                            {player.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--theme-text-light, #9aa4b2)' }}>
                      {player.position}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--theme-text-light, #9aa4b2)' }}>
                      {player.year}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(entries[index]?.spotlight)}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          dispatchFields({
                            type: 'UPDATE',
                            path: `players.${index}.spotlight`,
                            value: event.target.checked,
                          });
                          setModified(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
