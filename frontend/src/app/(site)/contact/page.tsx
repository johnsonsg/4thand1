import type { Metadata } from "next";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { ContactSection } from "@/components/sections/ContactSection";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";
import { getSiteMetadata } from "@/lib/services/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata("/contact");
  return {
    title: `Contact | ${metadata.titleSuffix}`,
    description: metadata.description,
  };
}

export default async function ContactPage() {
  const { navbar, footer, theme, main } = await getSiteLayout("/contact");
  const themeStyle = buildThemeStyle(theme);
  const contactRendering = main.find((component) => component.componentName === "ContactSection");

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main>
        <ContactSection rendering={contactRendering} />
      </main>
      <Footer rendering={footer} />
    </>
  );
}
