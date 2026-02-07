import Image from "next/image";

const players = [
  {
    name: "Marcus Johnson",
    number: "7",
    position: "Quarterback",
    stats: "2,340 YDS / 22 TD / 4 INT",
    image: "/images/player-spotlight.jpg",
  },
  {
    name: "David Chen",
    number: "22",
    position: "Running Back",
    stats: "890 YDS / 12 TD / 5.8 YPC",
    image: "/images/game-action.jpg",
  },
  {
    name: "James Williams",
    number: "55",
    position: "Linebacker",
    stats: "48 TKL / 6 SCK / 2 FF",
    image: "/images/team-huddle.jpg",
  },
];

export function RosterSpotlight() {
  return (
    <section id="roster" className="bg-secondary/50 py-24">
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
          <a
            href="#"
            className="hidden font-display text-sm font-medium uppercase tracking-wider text-primary transition-colors hover:text-primary/80 md:block"
          >
            Full Roster &rarr;
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {players.map((player) => (
            <div
              key={player.name}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={player.image || "/images/player-spotlight.jpg"}
                  alt={`${player.name}, ${player.position} #${player.number}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>

              {/* Number overlay */}
              <div className="absolute right-4 top-4">
                <span className="font-display text-6xl font-bold text-foreground/20">
                  {player.number}
                </span>
              </div>

              {/* Info */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
