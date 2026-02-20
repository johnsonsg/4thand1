'use client';

import * as React from 'react';
import {
  Button as PayloadButton,
  CheckboxInput,
  SelectInput,
  TextInput,
  TextareaInput,
  useDocumentForm,
  useField,
} from '@payloadcms/ui';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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

type PlayerFormValues = Omit<PlayerEntry, 'positionGroup' | 'accolades'> & {
  positionGroup: Player['positionGroup'];
  accoladesText?: string;
  accolades?: PlayerEntry['accolades'];
};

const isPositionGroup = (value: string): value is Player['positionGroup'][number] =>
  value === 'Offense' || value === 'Defense' || value === 'Special Teams';

const POSITION_GROUPS: Player['positionGroup'][number][] = ['Offense', 'Defense', 'Special Teams'];
const POSITION_GROUP_OPTIONS = POSITION_GROUPS.map((value) => ({ label: value, value }));

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

const adminTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2a3342',
    },
    background: {
      default: '#0b0f1a',
      paper: '#000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9aa4b2',
    },
    divider: '#2a3342',
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: 'var(--theme-text, #ffffff)',
          padding: '8px 12px',
          fontSize: '0.875rem',
          lineHeight: 1.25,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--theme-input-bg)',
          color: 'var(--theme-text, #ffffff)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--theme-elevation-150)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: '1px solid var(--theme-elevation-150)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--theme-elevation-400)',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--theme-text-light, #9aa4b2)',
          '&.Mui-focused': {
            color: 'var(--theme-brand, #d4a017)',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'var(--theme-text-light, #9aa4b2)',
        },
      },
    },
  },
});

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
  const { getDataByPath, setModified } = useDocumentForm() as {
    getDataByPath: (path: string) => unknown;
    setModified: (modified: boolean) => void;
  };
  const { value: playersValue = [], setValue } = useField<PlayerEntry[]>({ path: 'players' });
  const [imageMap, setImageMap] = React.useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [formValues, setFormValues] = React.useState<PlayerFormValues>({
    name: '',
    number: '',
    position: '',
    positionGroup: ['Offense'],
    spotlight: false,
    year: '',
    height: '',
    weight: '',
    image: '',
    stats: '',
    hudlUrl: '',
    bio: '',
    accoladesText: '',
    sortOrder: 0,
  });

  const { rows, players } = React.useMemo(() => {
    const raw = getDataByPath('players') as PlayerEntry[] | undefined;
    const source = Array.isArray(raw)
      ? raw
      : Array.isArray(playersValue)
        ? playersValue
        : [];
    const rowsWithIndex = source.map((entry, index) => ({ entry, index }));
    rowsWithIndex.sort((a, b) => (a.entry?.sortOrder ?? 0) - (b.entry?.sortOrder ?? 0));
    return { rows: rowsWithIndex, players: rowsWithIndex.map(({ entry }) => mapPlayer(entry)) };
  }, [getDataByPath, playersValue]);

  const openAddDialog = React.useCallback(() => {
    setEditingIndex(null);
    setFormValues({
      name: '',
      number: '',
      position: '',
      positionGroup: ['Offense'],
      spotlight: false,
      year: '',
      height: '',
      weight: '',
      image: '',
      stats: '',
      hudlUrl: '',
      bio: '',
      accoladesText: '',
      sortOrder: 0,
    });
    setDialogOpen(true);
  }, []);

  const openEditDialog = React.useCallback((entryIndex: number, entry: PlayerEntry) => {
    const accoladesText = Array.isArray(entry.accolades)
      ? entry.accolades.map((item) => item?.title ?? '').filter(Boolean).join('\n')
      : '';
    setEditingIndex(entryIndex);
    setFormValues({
      ...entry,
      positionGroup: Array.isArray(entry.positionGroup)
        ? entry.positionGroup.filter(isPositionGroup)
        : entry.positionGroup && isPositionGroup(entry.positionGroup)
          ? [entry.positionGroup]
          : ['Offense'],
      accoladesText,
    });
    setDialogOpen(true);
  }, []);

  const handleDialogClose = React.useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleSavePlayer = React.useCallback(() => {
    if (!formValues.name) return;
    const next = Array.isArray(playersValue) ? [...playersValue] : [];
    const accolades = formValues.accoladesText
      ? formValues.accoladesText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((title) => ({ title }))
      : [];

    const payloadEntry: PlayerEntry = {
      ...formValues,
      positionGroup: formValues.positionGroup,
      accolades,
    };

    delete (payloadEntry as { accoladesText?: string }).accoladesText;

    if (editingIndex !== null && next[editingIndex]) {
      next[editingIndex] = payloadEntry;
    } else {
      next.push(payloadEntry);
    }

    setValue(next);
    setModified(true);
    setDialogOpen(false);
  }, [editingIndex, formValues, playersValue, setModified, setValue]);

  React.useEffect(() => {
    const ids = new Set<string>();
    for (const { entry } of rows) {
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
  }, [rows, imageMap]);

  return (
    <div className="field-type">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        <h3 className="array-field__title" style={{ margin: 0 }}>
          Team Roster
        </h3>
        <PayloadButton
          buttonStyle="icon-label"
          size="small"
          icon={['plus']}
          iconStyle="with-border"
          onClick={openAddDialog}
        >
          Add Player
        </PayloadButton>
      </div>
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
                {players.map((player, index) => {
                  const row = rows[index];
                  if (!row) return null;
                  const entry = row.entry;
                  const entryIndex = row.index;

                  return (
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
                            const raw = resolvePlayerImage(entry?.image);
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
                          <button
                            type="button"
                            onClick={() => openEditDialog(entryIndex, entry)}
                            style={{
                              padding: 0,
                              border: 0,
                              background: 'transparent',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              color: 'inherit',
                              cursor: 'pointer',
                            }}
                          >
                            {player.name}
                          </button>
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
                        checked={Boolean(entry?.spotlight)}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          const next = Array.isArray(playersValue) ? [...playersValue] : [];
                          next[entryIndex] = { ...next[entryIndex], spotlight: event.target.checked };
                          setValue(next);
                          setModified(true);
                        }}
                      />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ThemeProvider theme={adminTheme}>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: '#000000',
            color: 'var(--theme-text, #ffffff)',
          },
        }}
      >
        <DialogTitle>{editingIndex === null ? 'Add Player' : 'Edit Player'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextInput
            path={`players.${editingIndex ?? 'new'}.name`}
            label="Name"
            required
            value={formValues.name ?? ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
          />
          <TextInput
            path={`players.${editingIndex ?? 'new'}.number`}
            label="Number"
            value={formValues.number ?? ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, number: event.target.value }))}
          />
          <TextInput
            path={`players.${editingIndex ?? 'new'}.position`}
            label="Position"
            value={formValues.position ?? ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, position: event.target.value }))}
          />
          <SelectInput
            path={`players.${editingIndex ?? 'new'}.positionGroup`}
            name="positionGroup"
            label="Position Group"
            hasMany
            options={POSITION_GROUP_OPTIONS}
            value={formValues.positionGroup}
            onChange={(value) => {
              const next = Array.isArray(value)
                ? value.map((item) => String(item.value)).filter(isPositionGroup)
                : value
                  ? [String(value.value)].filter(isPositionGroup)
                  : [];
              setFormValues((prev) => ({ ...prev, positionGroup: next }));
            }}
          />
          <CheckboxInput
            label="Spotlight"
            checked={Boolean(formValues.spotlight)}
            onToggle={(event: any) =>
              setFormValues((prev) => ({ ...prev, spotlight: event.target.checked }))
            }
          />
          <TextInput
            path={`players.${editingIndex ?? 'new'}.year`}
            label="Year"
            value={formValues.year ?? ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, year: event.target.value }))}
          />
          <TextInput
            path={`players.${editingIndex ?? 'new'}.height`}
            label="Height"
            value={formValues.height ?? ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, height: event.target.value }))}
          />
          <TextInput
            path={`players.${editingIndex ?? 'new'}.weight`}
            label="Weight"
            value={formValues.weight ?? ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, weight: event.target.value }))}
          />
          <TextInput
            path={`players.${editingIndex ?? 'new'}.stats`}
            label="Stats"
            value={formValues.stats ?? ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, stats: event.target.value }))}
          />
          <TextInput
            path={`players.${editingIndex ?? 'new'}.hudlUrl`}
            label="Hudl URL"
            value={formValues.hudlUrl ?? ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, hudlUrl: event.target.value }))}
          />
          <TextareaInput
            path={`players.${editingIndex ?? 'new'}.bio`}
            label="Bio"
            rows={3}
            value={formValues.bio ?? ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, bio: event.target.value }))}
          />
          <TextareaInput
            path={`players.${editingIndex ?? 'new'}.accolades`}
            label="Accolades (one per line)"
            rows={3}
            value={formValues.accoladesText ?? ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, accoladesText: event.target.value }))}
          />
          <TextInput
            path={`players.${editingIndex ?? 'new'}.image`}
            label="Featured Image (media ID or URL)"
            value={typeof formValues.image === 'string' ? formValues.image : ''}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, image: event.target.value }))}
          />
          <TextInput
            path={`players.${editingIndex ?? 'new'}.sortOrder`}
            label="Sort Order"
            value={String(formValues.sortOrder ?? 0)}
            onChange={(event: any) => setFormValues((prev) => ({ ...prev, sortOrder: Number(event.target.value) }))}
          />
        </DialogContent>
        <DialogActions>
          <PayloadButton buttonStyle="secondary" size="small" onClick={handleDialogClose}>
            Cancel
          </PayloadButton>
          <PayloadButton buttonStyle="primary" size="small" onClick={handleSavePlayer}>
            Save Player
          </PayloadButton>
        </DialogActions>
      </Dialog>
      </ThemeProvider>
    </div>
  );
}
