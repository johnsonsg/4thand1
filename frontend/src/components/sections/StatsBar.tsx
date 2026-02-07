const stats = [
  { label: "Seasons", value: "73" },
  { label: "District Titles", value: "12" },
  { label: "State Appearances", value: "5" },
  { label: "All-State Players", value: "48" },
];

export function StatsBar() {
  return (
    <section className="border-y border-border bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="mb-1 font-display text-4xl font-bold text-primary md:text-5xl">
                {stat.value}
              </p>
              <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
