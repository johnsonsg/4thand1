import type { Metadata } from "next";
import { RosterTable } from "@/components/sections/RosterTable";
import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";
import { getPlayers } from "@/lib/services/players";
import { getSiteMetadata } from "@/lib/services/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata("/roster");
  return {
    title: `Roster | ${metadata.titleSuffix}`,
    description: metadata.description,
  };
}

export default async function RosterPage() {
  const { navbar, footer, theme } = await getSiteLayout("/roster");
  const themeStyle = buildThemeStyle(theme);
  const players = await getPlayers();

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main>
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12">
              <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">
                2025-2026 Season
              </p>
              <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
                Full Roster
              </h1>
            </div>
            <RosterTable players={players} />
          </div>
        </section>
      </main>
      <Footer rendering={footer} />
    </>
  );
}
