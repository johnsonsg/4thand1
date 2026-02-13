"use client";

import { RosterTable } from "@/components/sections/RosterTable";
import { players as fallbackPlayers, type Player } from "@/lib/players";
import type { ComponentRendering, Field } from "@/lib/types/cms";

type RosterPageFields = {
  seasonLabel?: Field<string>;
  title?: Field<string>;
  players?: Field<Player[]>;
};

type RosterPageProps = {
  rendering: ComponentRendering;
};

export function RosterPage({ rendering }: RosterPageProps) {
  const fields = (rendering.fields ?? {}) as unknown as RosterPageFields;
  const seasonLabel = fields.seasonLabel?.value ?? "2025-2026 Season";
  const title = fields.title?.value ?? "Full Roster";
  const rosterPlayers = fields.players?.value ?? fallbackPlayers;

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">
            {seasonLabel}
          </p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
        </div>
        <RosterTable players={rosterPlayers} />
      </div>
    </section>
  );
}
