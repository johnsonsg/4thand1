import type { Metadata } from "next";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { ContactSection } from "@/components/sections/ContactSection";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";

export const metadata: Metadata = {
  title: "Contact | Westfield Eagles Football",
  description: "Contact the Westfield Eagles football program.",
};

export default async function ContactPage() {
  const { navbar, footer, theme } = await getSiteLayout("/contact");
  const themeStyle = buildThemeStyle(theme);

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main>
        <ContactSection />
      </main>
      <Footer rendering={footer} />
    </>
  );
}
