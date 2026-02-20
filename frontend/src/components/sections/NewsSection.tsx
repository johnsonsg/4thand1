"use client";

import Image from "next/image";
import Link from "next/link";
import MuiCard from "@mui/material/Card";
import MuiCardContent from "@mui/material/CardContent";
import type { ComponentRendering, Field } from "@/lib/types/cms";
import type { Article } from "@/lib/articles";
import { articles as fallbackArticles } from "@/lib/articles";

type NewsSectionFields = {
  articles?: Field<Article[]>;
  showViewAll?: Field<boolean>;
};

type NewsSectionProps = {
  showViewAll?: boolean;
  articles?: Article[];
  rendering?: ComponentRendering;
};

export function NewsSection({ showViewAll, articles, rendering }: NewsSectionProps) {
  const fields = (rendering?.fields ?? {}) as NewsSectionFields;
  const resolvedShowViewAll = showViewAll ?? fields.showViewAll?.value ?? true;
  const resolvedArticles = articles ?? fields.articles?.value ?? fallbackArticles;
  const displayArticles = resolvedShowViewAll ? resolvedArticles.slice(0, 3) : resolvedArticles;

  return (
    <section id="news" className="py-14">
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
          {resolvedShowViewAll ? (
            <Link
              href="/news"
              className="hidden font-display text-sm font-medium uppercase tracking-wider text-primary transition-colors hover:text-primary/80 md:block"
            >
              View All &rarr;
            </Link>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {displayArticles.map((article) => (
            <MuiCard
              key={article.title}
              component={Link}
              href={`/news/${article.slug}`}
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
