import type { Metadata } from "next";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import Placeholder from "@/lib/utils/Placeholder";
import type { RouteData } from "@/lib/types/cms";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";
import { getSiteMetadata } from "@/lib/services/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata("/tickets");
  return {
    title: `Tickets | ${metadata.titleSuffix}`,
    description: metadata.description,
  };
}

export default async function TicketsPage() {
  const { navbar, footer, theme, main } = await getSiteLayout("/tickets");
  const themeStyle = buildThemeStyle(theme);
  const coreComponents = main.filter(
    (component) => !["Navbar", "Footer", "NavSpacer"].includes(component.componentName),
  );
  const route: RouteData = { placeholders: { main: coreComponents } };

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main className="mx-auto max-w-4xl px-6 py-24">
        <Placeholder name="main" rendering={route} />
      </main>
      <Footer rendering={footer} />
    </>
  );
}
