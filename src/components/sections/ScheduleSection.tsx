"use client";

import Chip from "@mui/material/Chip";

const games = [
  {
    date: "Sep 5",
    opponent: "Lincoln Lions",
    location: "Home",
    time: "7:00 PM",
    result: "W 28-14",
    status: "final" as const,
  },
  {
    date: "Sep 12",
    opponent: "Roosevelt Bears",
    location: "Away",
    time: "7:30 PM",
    result: "W 35-21",
    status: "final" as const,
  },
  {
    date: "Sep 19",
    opponent: "Jefferson Jaguars",
    location: "Home",
    time: "7:00 PM",
    result: "L 17-24",
    status: "final" as const,
  },
  {
    date: "Sep 26",
    opponent: "Hamilton Hawks",
    location: "Away",
    time: "7:00 PM",
    result: "W 42-7",
    status: "final" as const,
  },
  {
    date: "Oct 3",
    opponent: "Madison Panthers",
    location: "Home",
    time: "7:00 PM",
    result: null,
    status: "upcoming" as const,
  },
  {
    date: "Oct 10",
    opponent: "Washington Wolves",
    location: "Away",
    time: "7:30 PM",
    result: null,
    status: "upcoming" as const,
  },
];

export function ScheduleSection() {
  return (
    <section id="schedule" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">
              2025 Season
            </p>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              Game Schedule
            </h2>
          </div>
          <p className="hidden text-sm text-muted-foreground md:block">
            Record: 3-1
          </p>
        </div>

        <div className="space-y-2">
          {games.map((game) => (
            <div
              key={game.date + game.opponent}
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-6 py-5 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center gap-6">
                <span className="w-16 font-display text-sm font-semibold uppercase text-muted-foreground">
                  {game.date}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold uppercase tracking-wide text-card-foreground">
                    {game.opponent}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {game.location} &middot; {game.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {game.status === "final" && game.result ? (
                  <Chip
                    label={game.result}
                    size="small"
                    sx={{
                      bgcolor: game.result.startsWith("W")
                        ? "primary.main"
                        : "secondary.main",
                      color: game.result.startsWith("W")
                        ? "primary.contrastText"
                        : "secondary.contrastText",
                    }}
                  />
                ) : (
                  <Chip
                    label="Upcoming"
                    size="small"
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
