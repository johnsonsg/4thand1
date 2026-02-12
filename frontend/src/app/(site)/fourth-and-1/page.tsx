import type { Metadata } from "next";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { FourthAndOneContent } from "@/components/sections/FourthAndOneContent";
import type { ComponentRendering } from "@/lib/types/cms";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";

export const metadata: Metadata = {
  title: "4th&1 | Westfield Eagles Football",
  description: "Fourth and 1 content for the Westfield Eagles football program.",
};

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
