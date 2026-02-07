"use client";

import Image from "next/image";
import MuiCard from "@mui/material/Card";
import MuiCardContent from "@mui/material/CardContent";

const articles = [
  {
    title: "Eagles Clinch Third Straight Victory with Dominant Performance",
    date: "Sep 27, 2025",
    excerpt:
      "A commanding 42-7 win over the Hamilton Hawks puts the Eagles at 3-1 heading into the second half of the season.",
    image: "/images/news-1.jpg",
    category: "Game Recap",
  },
  {
    title: "Fall Camp Wrap-Up: New Faces Ready to Contribute",
    date: "Aug 20, 2025",
    excerpt:
      "Head Coach Rivera highlights key newcomers who impressed during fall training camp and are poised for breakout seasons.",
    image: "/images/news-2.jpg",
    category: "Team News",
  },
  {
    title: "Homecoming Game Set for October 17 Against Rival Central",
    date: "Sep 15, 2025",
    excerpt:
      "Mark your calendars for the biggest game of the year. Pre-game festivities start at 4 PM with kickoff at 7 PM.",
    image: "/images/news-3.jpg",
    category: "Events",
  },
];

export function NewsSection() {
  return (
    <section id="news" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Latest Updates
            </p>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              Eagles News
            </h2>
          </div>
          <a
            href="#"
            className="hidden font-display text-sm font-medium uppercase tracking-wider text-primary transition-colors hover:text-primary/80 md:block"
          >
            View All &rarr;
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <MuiCard
              key={article.title}
              sx={{
                cursor: "pointer",
                overflow: "hidden",
                transition: "border-color 0.2s",
                "&:hover": { borderColor: "rgba(212,160,23,0.3)" },
              }}
              className="group"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={article.image || "/images/news-1.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3">
                  <span className="rounded bg-primary px-2 py-1 font-display text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                    {article.category}
                  </span>
                </div>
              </div>
              <MuiCardContent className="p-6">
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  {article.date}
                </p>
                <h3 className="mb-3 font-display text-lg font-semibold uppercase leading-snug text-card-foreground transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </MuiCardContent>
            </MuiCard>
          ))}
        </div>
      </div>
    </section>
  );
}
