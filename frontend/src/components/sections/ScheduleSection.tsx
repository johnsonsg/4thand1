"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, MapPin, Trophy } from "lucide-react";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import type { ComponentRendering, Field } from "@/lib/types/cms";

type GameStatus = "final" | "upcoming";

type Game = {
  dateTime: string;
  opponent: string;
  location: string;
  outcome?: "W" | "L" | "T" | "BYE" | null;
  result?: string | null;
  status: GameStatus;
};

type ScheduleFields = {
  seasonLabel?: Field<string>;
  title?: Field<string>;
  record?: Field<string>;
  winChipBackgroundColor?: Field<string>;
  winChipTextColor?: Field<string>;
  games?: Field<Game[]>;
};

const DEFAULT_GAMES: Game[] = [
  {
    dateTime: "2025-09-05T19:00:00.000Z",
    opponent: "Lincoln Lions",
    location: "Home",
    outcome: "W",
    result: "W 28-14",
    status: "final",
  },
  {
    dateTime: "2025-09-12T19:30:00.000Z",
    opponent: "Roosevelt Bears",
    location: "Away",
    outcome: "W",
    result: "W 35-21",
    status: "final",
  },
  {
    dateTime: "2025-09-19T19:00:00.000Z",
    opponent: "Jefferson Jaguars",
    location: "Home",
    outcome: "L",
    result: "L 17-24",
    status: "final",
  },
  {
    dateTime: "2025-09-26T19:00:00.000Z",
    opponent: "Hamilton Hawks",
    location: "Away",
    outcome: "W",
    result: "W 42-7",
    status: "final",
  },
  {
    dateTime: "2025-10-03T19:00:00.000Z",
    opponent: "Madison Panthers",
    location: "Home",
    result: null,
    status: "upcoming",
  },
  {
    dateTime: "2025-10-10T19:30:00.000Z",
    opponent: "Washington Wolves",
    location: "Away",
    result: null,
    status: "upcoming",
  },
];

type ScheduleProps = {
  rendering: ComponentRendering;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

export function ScheduleSection({ rendering }: ScheduleProps) {
  const fields = (rendering.fields ?? {}) as unknown as ScheduleFields;
  const seasonLabel = fields.seasonLabel?.value ?? "2025 Season";
  const title = fields.title?.value ?? "Game Schedule";
  const record = fields.record?.value ?? "Record: 3-1";
  const winChipBgColor = fields.winChipBackgroundColor?.value;
  const winChipTxtColor = fields.winChipTextColor?.value;
  const games = fields.games?.value ?? DEFAULT_GAMES;

  const [filter, setFilter] = useState<'all' | 'home' | 'away'>('all');

  const filteredGames = games.filter((game) => {
    if (filter === 'all') return true;
    return game.location.toLowerCase() === filter;
  });

  return (
    <section id="schedule" className="py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-center justify-between md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">
              {seasonLabel}
            </p>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              {title}
            </h2>
          </div>
          <p className="mt-4 text-center text-muted-foreground md:mt-0 md:text-right md:pr-5">
            <span className="">Record:</span> {" "}
            <span className="text-white text-lg font-bold">{record}</span>
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2 md:justify-start">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-md px-4 py-2 text-sm font-semibold uppercase transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => setFilter('home')}
            className={`rounded-md px-4 py-2 text-sm font-semibold uppercase transition-colors ${
              filter === 'home'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setFilter('away')}
            className={`rounded-md px-4 py-2 text-sm font-semibold uppercase transition-colors ${
              filter === 'away'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Away
          </button>
        </div>

        <div className="space-y-2">
          {filteredGames.map((game) => (
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
                        game.location === "Home"
                          ? "text-primary font-semibold"
                          : game.location === "Away"
                            ? "text-secondary-foreground font-semibold"
                            : "text-muted-foreground font-semibold"
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
                    const resultText =
                      game.result
                        ? `${game.outcome ? `${game.outcome} ` : ""}${game.result}`
                        : game.outcome ?? "";
                    const isWin = game.outcome
                      ? game.outcome === "W"
                      : resultText.startsWith("W");
                    const isTie = game.outcome === "T" || resultText.startsWith("T");
                    const isBye = game.outcome === "BYE" || resultText.startsWith("BYE");

                    const chipBg =
                      isWin
                        ? (winChipBgColor || "primary.main")
                        : isTie || isBye
                          ? "secondary.main"
                          : "secondary.main";
                    const chipColor =
                      isWin
                        ? (winChipTxtColor || "primary.contrastText")
                        : "secondary.contrastText";

                    return (
                      <Chip
                        label={resultText}
                        sx={{
                          bgcolor: chipBg,
                          color: chipColor,
                        }}
                        className="text-md"
                      />
                    );
                  })()
                ) : (
                  <Chip
                    label="Upcoming"
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
