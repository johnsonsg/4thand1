import type { Metadata } from "next";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { NewsSection } from "@/components/sections/NewsSection";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";
import { getSiteMetadata } from "@/lib/services/metadata";
import { getNewsArticles } from "@/lib/services/news";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata("/news");
  return {
    title: `News | ${metadata.titleSuffix}`,
    description: metadata.description,
  };
}

export default async function NewsPage() {
  const { navbar, footer, theme } = await getSiteLayout("/news");
  const newsArticles = await getNewsArticles();
  const themeStyle = buildThemeStyle(theme);

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main>
        <NewsSection showViewAll={false} articles={newsArticles} />
      </main>
      <Footer rendering={footer} />
    </>
  );
}
