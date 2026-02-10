"use client";

import Chip from "@mui/material/Chip";
import type { ComponentRendering, Field } from '@/lib/types/cms';

type GameStatus = 'final' | 'upcoming';

type Game = {
  dateTime: string;
  opponent: string;
  location: string;
  outcome?: 'W' | 'L' | 'T' | 'BYE' | null;
  result?: string | null;
  status: GameStatus;
};

type ScheduleFields = {
  seasonLabel?: Field<string>;
  title?: Field<string>;
  record?: Field<string>;
  games?: Field<Game[]>;
};

const DEFAULT_GAMES: Game[] = [
  {
    dateTime: '2025-09-05T19:00:00.000Z',
    opponent: 'Lincoln Lions',
    location: 'Home',
    outcome: 'W',
    result: 'W 28-14',
    status: 'final',
  },
  {
    dateTime: '2025-09-12T19:30:00.000Z',
    opponent: 'Roosevelt Bears',
    location: 'Away',
    outcome: 'W',
    result: 'W 35-21',
    status: 'final',
  },
  {
    dateTime: '2025-09-19T19:00:00.000Z',
    opponent: 'Jefferson Jaguars',
    location: 'Home',
    outcome: 'L',
    result: 'L 17-24',
    status: 'final',
  },
  {
    dateTime: '2025-09-26T19:00:00.000Z',
    opponent: 'Hamilton Hawks',
    location: 'Away',
    outcome: 'W',
    result: 'W 42-7',
    status: 'final',
  },
  {
    dateTime: '2025-10-03T19:00:00.000Z',
    opponent: 'Madison Panthers',
    location: 'Home',
    result: null,
    status: 'upcoming',
  },
  {
    dateTime: '2025-10-10T19:30:00.000Z',
    opponent: 'Washington Wolves',
    location: 'Away',
    result: null,
    status: 'upcoming',
  },
];

type ScheduleProps = {
  rendering: ComponentRendering;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

export function ScheduleSection({ rendering }: ScheduleProps) {
  const fields = (rendering.fields ?? {}) as unknown as ScheduleFields;
  const seasonLabel = fields.seasonLabel?.value ?? '2025 Season';
  const title = fields.title?.value ?? 'Game Schedule';
  const record = fields.record?.value ?? 'Record: 3-1';
  const games = fields.games?.value ?? DEFAULT_GAMES;

  return (
    <section id="schedule" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">
              {seasonLabel}
            </p>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              {title}
            </h2>
          </div>
          <p className="hidden text-muted-foreground md:block pr-5">
            <span className="">Record:</span> {' '}
            <span className="text-white text-lg font-bold">{record}</span>
          </p>
        </div>

        <div className="space-y-2">
          {games.map((game) => (
            <div
              key={game.dateTime + game.opponent}
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-6 py-5 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center gap-6">
                <span className="w-16 font-display text-sm font-semibold uppercase text-muted-foreground">
                  {formatDate(game.dateTime)}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold uppercase tracking-wide text-card-foreground">
                    {game.opponent}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span
                      className={
                        game.location === 'Home'
                          ? 'text-primary font-semibold'
                          : game.location === 'Away'
                            ? 'text-secondary-foreground font-semibold'
                            : 'text-muted-foreground font-semibold'
                      }
                    >
                      {game.location}
                    </span>{' '}
                    &middot; {formatTime(game.dateTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {game.status === "final" && (game.result || game.outcome) ? (
                  (() => {
                    const resultText = game.result
                      ? `${game.outcome ? `${game.outcome} ` : ''}${game.result}`
                      : game.outcome ?? '';
                    const isWin = game.outcome
                      ? game.outcome === 'W'
                      : resultText.startsWith('W');
                    const isTie = game.outcome === 'T' || resultText.startsWith('T');
                    const isBye = game.outcome === 'BYE' || resultText.startsWith('BYE');

                    const chipBg = isWin
                      ? 'primary.main'
                      : isTie || isBye
                        ? 'secondary.main'
                        : 'secondary.main';
                    const chipColor = isWin
                      ? 'primary.contrastText'
                      : 'secondary.contrastText';

                    return (
                      <Chip
                        label={resultText}
                        // size="small"
                        sx={{
                          bgcolor: chipBg,
                          color: chipColor,
                        }}
                        className='text-md'
                      />
                    );
                  })()
                ) : (
                  <Chip
                    label="Upcoming"
                    // size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(212,160,23,0.4)",
                      color: "primary.main",
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
