import type { Metadata } from "next";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { NewsSection } from "@/components/sections/NewsSection";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";

export const metadata: Metadata = {
  title: "News | Westfield Eagles Football",
  description: "Latest news and updates from the Westfield Eagles football program.",
};

export default async function NewsPage() {
  const { navbar, footer, theme } = await getSiteLayout("/news");
  const themeStyle = buildThemeStyle(theme);

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main>
        <NewsSection />
      </main>
      <Footer rendering={footer} />
    </>
  );
}
