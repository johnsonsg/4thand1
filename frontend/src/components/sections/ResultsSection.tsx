"use client";

import * as React from 'react';

const results = [
  { date: 'Sep 5', opponent: 'Lincoln Lions', score: 'W 28-14' },
  { date: 'Sep 12', opponent: 'Roosevelt Bears', score: 'W 35-21' },
  { date: 'Sep 19', opponent: 'Jefferson Jaguars', score: 'L 17-24' },
  { date: 'Sep 26', opponent: 'Hamilton Hawks', score: 'W 42-7' },
];

export function ResultsSection() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">Season</p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">Results</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            This page is a placeholder for real game results. When your CMS is live, these can come from your backend instead of hardcoded data.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="grid grid-cols-3 gap-4 border-b border-border px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div>Date</div>
            <div>Opponent</div>
            <div>Result</div>
          </div>
          <div className="divide-y divide-border">
            {results.map((r) => (
              <div key={`${r.date}-${r.opponent}`} className="grid grid-cols-3 gap-4 px-6 py-4">
                <div className="font-display text-sm font-semibold uppercase text-foreground">{r.date}</div>
                <div className="text-sm text-muted-foreground">{r.opponent}</div>
                <div className="font-display text-sm font-semibold uppercase text-primary">{r.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
