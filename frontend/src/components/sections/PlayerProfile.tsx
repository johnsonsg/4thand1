"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPlayerById } from "@/lib/players";
import type { ComponentRendering, Field } from "@/lib/types/cms";

type PlayerProfileFields = {
  playerId?: Field<string>;
};

type PlayerProfileProps = {
  rendering: ComponentRendering;
};

export function PlayerProfile({ rendering }: PlayerProfileProps) {
  const fields = (rendering.fields ?? {}) as unknown as PlayerProfileFields;
  const playerId = fields.playerId?.value;
  
  const player = playerId ? getPlayerById(playerId) : null;

  if (!player) {
    return (
      <section className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-muted-foreground">Player not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Back link */}
        <Link
          href="/roster"
          className="mb-10 inline-flex items-center gap-2 font-display text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Roster
        </Link>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Player image */}
          <div className="relative shrink-0">
            <div className="relative h-96 w-full overflow-hidden rounded-xl lg:h-[500px] lg:w-80">
              <Image
                src={player.image || "/placeholder.svg"}
                alt={`${player.name}, ${player.position} #${player.number}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            {/* Number overlay */}
            <div className="absolute right-4 top-4">
              <span className="font-display text-7xl font-bold text-foreground/15">
                {player.number}
              </span>
            </div>
          </div>

          {/* Player info */}
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="font-display text-4xl font-bold text-primary">
                #{player.number}
              </span>
              <span className="rounded bg-secondary px-3 py-1 font-display text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {player.positionGroup}
              </span>
            </div>

            <h1 className="mb-2 font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              {player.name}
            </h1>

            <p className="mb-8 font-display text-lg font-medium uppercase tracking-wider text-muted-foreground">
              {player.position}
            </p>

            {/* Details grid */}
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Year", value: player.year },
                { label: "Height", value: player.height },
                { label: "Weight", value: player.weight },
                { label: "Position", value: player.position },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-secondary/50 p-4"
                >
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="font-display text-lg font-bold uppercase text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Season stats */}
            <div className="mb-10">
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Season Stats
              </h2>
              <div className="rounded-lg border border-border bg-secondary/50 px-5 py-4">
                <p className="font-display text-xl font-bold tracking-wider text-foreground">
                  {player.stats}
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-10">
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                About
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {player.bio}
              </p>
            </div>

            {/* Accolades */}
            {player.accolades.length > 0 && (
              <div>
                <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Accolades
                </h2>
                <ul className="flex flex-col gap-2">
                  {player.accolades.map((accolade) => (
                    <li
                      key={accolade}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {accolade}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
