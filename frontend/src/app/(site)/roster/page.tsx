import type { Metadata } from "next";
import { RosterTable } from "@/components/sections/RosterTable";
import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";

export const metadata: Metadata = {
  title: "Roster | Westfield Eagles Football",
  description:
    "View the full Westfield Eagles football roster. Players, positions, stats, and more.",
};

export default async function RosterPage() {
  const { navbar, footer, theme } = await getSiteLayout("/roster");
  const themeStyle = buildThemeStyle(theme);

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main>
        <section className="pt-28 pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12">
              <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">
                2025-2026 Season
              </p>
              <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
                Full Roster
              </h1>
            </div>
            <RosterTable />
          </div>
        </section>
      </main>
      <Footer rendering={footer} />
    </>
  );
}
