"use client";

import Image from "next/image";
import MuiButton from "@mui/material/Button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
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
        src="/images/hero-football.jpg"
        alt="Westfield Eagles football team celebrating under Friday night lights"
        fill
        className="object-cover"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40">
        <p className="mb-4 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">
          2025-2026 Season
        </p>
        <h1 className="mb-6 max-w-3xl font-display text-5xl font-bold uppercase leading-none tracking-tight text-foreground md:text-7xl lg:text-8xl">
          <span className="text-balance">Friday Night Lights</span>
        </h1>
        <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
          Home of the Westfield Eagles. Building champions on and off the field
          since 1952.
        </p>
        <div className="flex flex-wrap gap-4">
          <MuiButton
            variant="contained"
            size="large"
            endIcon={<ArrowRight className="h-4 w-4" />}
            component={Link}
            href="/schedule"
          >
            View Schedule
          </MuiButton>
          <MuiButton
            variant="outlined"
            size="large"
            component={Link}
            href="/news"
            sx={secondaryButtonSx}
          >
            Season Highlights
          </MuiButton>

          <MuiButton variant="outlined" size="large" component={Link} href="/roster" sx={secondaryButtonSx}>
            View Roster
          </MuiButton>

          <MuiButton variant="outlined" size="large" component={Link} href="/results" sx={secondaryButtonSx}>
            View Results
          </MuiButton>
        </div>
      </div>
    </section>
  );
}
