import type { Metadata } from "next";
import { headers } from "next/headers";
import { RosterTable } from "@/components/sections/RosterTable";
import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import type { CmsLayoutData, ComponentRendering } from "@/lib/types/cms";
import { fetchLayoutData } from "@/lib/services/layout";

export const metadata: Metadata = {
  title: "Roster | Westfield Eagles Football",
  description:
    "View the full Westfield Eagles football roster. Players, positions, stats, and more.",
};

export default async function RosterPage() {
  const reqHeaders = await headers();
  const layoutData = (await fetchLayoutData({
    path: "/roster",
    headers: reqHeaders,
  })) as CmsLayoutData;
  const main = layoutData.cms.route?.placeholders?.main ?? [];
  const navbarRendering =
    main.find((component) => component.componentName === "Navbar") ??
    ({ componentName: "Navbar", fields: {} } as ComponentRendering);
  const footerRendering =
    main.find((component) => component.componentName === "Footer") ??
    ({ componentName: "Footer", fields: {} } as ComponentRendering);

  return (
    <>
      <Navbar rendering={navbarRendering} />
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
      <Footer rendering={footerRendering} />
    </>
  );
}
