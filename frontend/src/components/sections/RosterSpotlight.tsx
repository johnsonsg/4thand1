"use client";

import Image from "next/image";
import Link from "next/link";
import { type Player } from "@/lib/players";
import type { ComponentRendering, Field } from "@/lib/types/cms";

type RosterSpotlightProps = {
  rendering: ComponentRendering;
};

type RosterSpotlightFields = {
  players?: Field<Player[]>;
};

export function RosterSpotlight({ rendering }: RosterSpotlightProps) {
  const fields = (rendering.fields ?? {}) as unknown as RosterSpotlightFields;
  const list = fields.players?.value ?? [];
  const spotlightSelections = list.filter((player) => player.spotlight);
  const spotlightPlayers = (spotlightSelections.length ? spotlightSelections : list).slice(0, 4);

  return (
    <section id="roster" className="bg-secondary/50 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Meet the Team
            </p>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              Player Spotlight
            </h2>
          </div>
          <Link
            href="/roster"
            className="hidden font-display text-sm font-medium uppercase tracking-wider text-primary transition-colors hover:text-primary/80 md:block"
          >
            Full Roster &rarr;
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {spotlightPlayers.map((player) => (
            <Link
              key={player.id}
              href={`/roster/${player.id}`}
              className="group relative overflow-hidden rounded-lg block"
            >
              <div className="relative aspect-3/4">
                <Image
                  src={player.image || "/placeholder.svg"}
                  alt={`${player.name}, ${player.position} #${player.number}`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
              </div>

              <div className="absolute right-4 top-4">
                <span className="font-display text-6xl font-bold text-foreground/20">
                  {player.number}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="mb-1 font-display text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  {player.position}
                </p>
                <h3 className="mb-2 font-display text-2xl font-bold uppercase text-foreground">
                  {player.name}
                </h3>
                <p className="text-sm tracking-wide text-muted-foreground">
                  {player.stats}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
