import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayerBySlug, getPlayerSlugs } from "@/lib/services/players";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import NavSpacer from "@/components/rendering/NavSpacer";
import { HudlIconButton } from "@/components/buttons/HudlIconButton";
import { ThemeTokensEffect } from "@/lib/theme/ThemeTokensEffect";
import { buildThemeStyle } from "@/lib/theme/buildThemeStyle";
import { getSiteLayout } from "@/lib/services/siteLayout";

export async function generateStaticParams() {
  const slugs = await getPlayerSlugs();
  return slugs.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const player = await getPlayerBySlug(id);
  if (!player) return { title: "Player Not Found" };
  return {
    title: `${player.name} #${player.number} | Westfield Eagles Football`,
    description: `${player.name} - ${player.position} for the Westfield Eagles. ${player.stats}`,
  };
}

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await getPlayerBySlug(id);
  if (!player) notFound();

  const { navbar, footer, theme } = await getSiteLayout("/roster");
  const themeStyle = buildThemeStyle(theme);

  return (
    <>
      {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
      <ThemeTokensEffect theme={theme} />
      <Navbar rendering={navbar} />
      <NavSpacer />
      <main>
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/roster"
              className="mb-10 inline-flex items-center gap-2 font-display text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Roster
            </Link>

            <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
              <div className="relative shrink-0">
                <div className="relative h-96 w-full overflow-hidden rounded-xl lg:h-[500px] lg:w-80">
                  <Image
                    src={player.image || "/placeholder.svg"}
                    alt={`${player.name}, ${player.position} #${player.number}`}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>
                <div className="absolute right-4 top-4">
                  <span className="font-display text-7xl font-bold text-foreground/15">
                    {player.number}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="font-display text-4xl font-bold text-primary">
                    #{player.number}
                  </span>
                  <span className="rounded bg-secondary px-3 py-1 font-display text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {player.positionGroup.join(" / ")}
                  </span>
                </div>

                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
                    {player.name}
                  </h1>
                  {player.hudlUrl ? <HudlIconButton href={player.hudlUrl} /> : null}
                </div>

                <p className="mb-8 font-display text-lg font-medium uppercase tracking-wider text-muted-foreground">
                  {player.position}
                </p>

                <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: "Year", value: player.year },
                    { label: "Height", value: player.height },
                    { label: "Weight", value: player.weight },
                    { label: "Position", value: player.position },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-border bg-secondary/50 p-4"
                    >
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-display text-lg font-bold uppercase text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mb-10">
                  <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Season Stats
                  </h2>
                  <div className="rounded-lg border border-border bg-secondary/50 px-5 py-4">
                    <p className="font-display text-xl font-bold tracking-wider text-foreground">
                      {player.stats}
                    </p>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    About
                  </h2>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {player.bio}
                  </p>
                </div>

                {player.accolades.length > 0 && (
                  <div>
                    <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Accolades
                    </h2>
                    <ul className="flex flex-col gap-2">
                      {player.accolades.map((accolade) => (
                        <li
                          key={accolade}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {accolade}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer rendering={footer} />
    </>
  );
}
