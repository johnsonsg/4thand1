import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import { articles, getArticleBySlug } from "@/lib/articles";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";
import { getSiteMetadata } from "@/lib/services/metadata";

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  const metadata = await getSiteMetadata("/news");
  return {
    title: `${article.title} | ${metadata.titleSuffix}`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { navbar, footer, theme } = await getSiteLayout("/news");
  const themeStyle = buildThemeStyle(theme);

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <main>
        <Navbar rendering={navbar} />

        <article className="mx-auto max-w-4xl px-6 pb-24 pt-32">
          {/* Back link */}
          <Link
            href="/news"
            className="mb-10 inline-flex items-center gap-2 font-display text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>

          {/* Category & date row */}
          <div className="mb-5 flex items-center gap-4">
            <span className="rounded bg-primary px-2.5 py-1 font-display text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              {article.category}
            </span>
            <span className="text-sm text-muted-foreground">{article.date}</span>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-balance font-display text-3xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="mb-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>

          {/* Author & divider */}
          <div className="mb-10 flex items-center gap-4 border-b border-border pb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <span className="font-display text-sm font-bold text-foreground">
                {article.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{article.author}</p>
              <p className="text-xs text-muted-foreground">Westfield Eagles Staff</p>
            </div>
          </div>

          {/* Featured image -- inline, constrained */}
          <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Body */}
          <div className="mx-auto max-w-2xl space-y-6">
            {article.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="mx-auto mt-12 max-w-2xl border-t border-border pt-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 font-display text-sm font-medium uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              More Eagles News
            </Link>
          </div>
        </article>

        <Footer rendering={footer} />
      </main>
    </>
  );
}
