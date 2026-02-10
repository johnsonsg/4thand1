import type { ComponentRendering, Field } from '@/lib/types/cms';

type StatItem = {
  label: string;
  value: string;
};

type StatsBarFields = {
  items?: Field<StatItem[]>;
};

const DEFAULT_STATS: StatItem[] = [
  { label: 'Seasons', value: '73' },
  { label: 'District Titles', value: '12' },
  { label: 'State Appearances', value: '5' },
  { label: 'All-State Players', value: '48' },
];

type StatsBarProps = {
  rendering: ComponentRendering;
};

export function StatsBar({ rendering }: StatsBarProps) {
  const fields = (rendering.fields ?? {}) as unknown as StatsBarFields;
  const stats = fields.items?.value?.slice(0, 6) ?? DEFAULT_STATS;

  return (
    <section className="border-y border-border bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 justify-items-center md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
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
