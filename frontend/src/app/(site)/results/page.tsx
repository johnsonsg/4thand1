import type { Metadata } from "next";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { ResultsSection } from "@/components/sections/ResultsSection";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";
import { getSiteMetadata } from "@/lib/services/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata("/results");
  return {
    title: `Results | ${metadata.titleSuffix}`,
    description: metadata.description,
  };
}

export default async function ResultsPage() {
  const { navbar, footer, theme } = await getSiteLayout("/results");
  const themeStyle = buildThemeStyle(theme);

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main>
        <ResultsSection />
      </main>
      <Footer rendering={footer} />
    </>
  );
}
