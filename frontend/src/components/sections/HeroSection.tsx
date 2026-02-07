"use client";

import Image from "next/image";
import MuiButton from "@mui/material/Button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentRendering, Field } from "@/lib/types/cms";

type ImageValue = {
  src: string;
  alt: string;
};

type HeroSectionFields = {
  kicker?: Field<string>;
  headline?: Field<string>;
  description?: Field<string>;
  backgroundImage?: Field<ImageValue>;

  primaryCtaLabel?: Field<string>;
  primaryCtaHref?: Field<string>;

  secondaryCtaLabel?: Field<string>;
  secondaryCtaHref?: Field<string>;

  tertiaryCtaLabel?: Field<string>;
  tertiaryCtaHref?: Field<string>;

  quaternaryCtaLabel?: Field<string>;
  quaternaryCtaHref?: Field<string>;
};

type HeroSectionProps = {
  rendering: ComponentRendering;
};

export function HeroSection({ rendering }: HeroSectionProps) {
  const fields = (rendering.fields ?? {}) as unknown as HeroSectionFields;

  const background = fields.backgroundImage?.value ?? {
    src: "/images/hero-football-v2.svg",
    alt: "Westfield Eagles football team celebrating under Friday night lights",
  };

  const kicker = fields.kicker?.value ?? "2025-2026 Season";
  const headline = fields.headline?.value ?? "Friday Night Lights";
  const description =
    fields.description?.value ?? "Home of the Westfield Eagles. Building champions on and off the field since 1952.";

  const primaryCta = {
    label: fields.primaryCtaLabel?.value ?? "View Schedule",
    href: fields.primaryCtaHref?.value ?? "/schedule",
  };
  const secondaryCta = {
    label: fields.secondaryCtaLabel?.value ?? "Season Highlights",
    href: fields.secondaryCtaHref?.value ?? "/news",
  };
  const tertiaryCta = {
    label: fields.tertiaryCtaLabel?.value ?? "View Roster",
    href: fields.tertiaryCtaHref?.value ?? "/roster",
  };
  const quaternaryCta = {
    label: fields.quaternaryCtaLabel?.value ?? "View Results",
    href: fields.quaternaryCtaHref?.value ?? "/results",
  };

  const secondaryButtonSx = (theme: any) => ({
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover,
    },
  });

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden">
      {/* Background image */}
      <Image
        src={background.src}
        alt={background.alt}
        fill
        className="object-cover"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40">
        <p className="mb-4 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">{kicker}</p>
        <h1 className="mb-6 max-w-3xl font-display text-5xl font-bold uppercase leading-none tracking-tight text-foreground md:text-7xl lg:text-8xl">
          <span className="text-balance">{headline}</span>
        </h1>
        <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-4">
          <MuiButton
            variant="contained"
            size="large"
            endIcon={<ArrowRight className="h-4 w-4" />}
            component={Link}
            href={primaryCta.href}
          >
            {primaryCta.label}
          </MuiButton>
          <MuiButton
            variant="outlined"
            size="large"
            component={Link}
            href={secondaryCta.href}
            sx={secondaryButtonSx}
          >
            {secondaryCta.label}
          </MuiButton>

          <MuiButton variant="outlined" size="large" component={Link} href={tertiaryCta.href} sx={secondaryButtonSx}>
            {tertiaryCta.label}
          </MuiButton>

          <MuiButton variant="outlined" size="large" component={Link} href={quaternaryCta.href} sx={secondaryButtonSx}>
            {quaternaryCta.label}
          </MuiButton>
        </div>
      </div>
    </section>
  );
}
