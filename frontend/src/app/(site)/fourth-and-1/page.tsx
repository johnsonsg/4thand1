import type { Metadata } from "next";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { FourthAndOneContent } from "@/components/sections/FourthAndOneContent";
import type { ComponentRendering } from "@/lib/types/cms";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";
import { getSiteMetadata } from "@/lib/services/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata("/fourth-and-1");
  return {
    title: `4th&1 | ${metadata.titleSuffix}`,
    description: metadata.description,
  };
}

export default async function FourthAndOnePage() {
  const { navbar, footer, theme, main } = await getSiteLayout("/fourth-and-1");
  const fourthAndOneRendering =
    main.find((component) => component.componentName === "FourthAndOne") ??
    ({ componentName: "FourthAndOne", fields: {} } as ComponentRendering);
  const themeStyle = buildThemeStyle(theme);

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main>
        <FourthAndOneContent rendering={fourthAndOneRendering} />
      </main>
      <Footer rendering={footer} />
    </>
  );
}
