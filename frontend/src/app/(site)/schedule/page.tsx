import type { Metadata } from "next";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import type { ComponentRendering } from "@/lib/types/cms";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";
import { getSiteMetadata } from "@/lib/services/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata("/schedule");
  return {
    title: `Schedule | ${metadata.titleSuffix}`,
    description: metadata.description,
  };
}

export default async function SchedulePage() {
  const { navbar, footer, theme, main } = await getSiteLayout("/schedule");
  const scheduleRendering =
    main.find((component) => component.componentName === "ScheduleSection") ??
    ({ componentName: "ScheduleSection", fields: {} } as ComponentRendering);
  const themeStyle = buildThemeStyle(theme);

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main>
        <ScheduleSection rendering={scheduleRendering} />
      </main>
      <Footer rendering={footer} />
    </>
  );
}
