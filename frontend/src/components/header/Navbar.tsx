"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Moon, Sun, X } from "lucide-react";
import { IoTicketSharp } from "react-icons/io5";
import { useAtom } from 'jotai';
import { themeModeAtom } from '@/state/atoms';
import type { ComponentRendering, Field } from '@/lib/types/cms';
import { BrandIdentity, type BrandImageValue } from "@/components/brand/BrandIdentity";

type NavLinkValue = {
  label: string;
  href: string;
};

type NavbarFields = {
  brandName?: Field<string>;
  brandSubtitle?: Field<string>;
  brandMark?: Field<string>;
  brandMarkImage?: Field<BrandImageValue>;
  brandLogo?: Field<BrandImageValue>;
  navLinks?: Field<NavLinkValue[]>;
  fourthAndOneLabel?: Field<string>;
  fourthAndOneHref?: Field<string>;
  fourthAndOneLogo?: Field<BrandImageValue>;
  ticketsUrl?: Field<string>;
};

type BrandFields = Pick<
  NavbarFields,
  "brandName" | "brandSubtitle" | "brandMark" | "brandMarkImage" | "brandLogo"
>;

export const brandDefaults = {
  brandName: "Manchester Lancers",
  brandSubtitle: "Football",
  brandMark: "M",
};

export const resolveBrandFields = (fields: BrandFields) => {
  const brandName = fields.brandName?.value ?? brandDefaults.brandName;
  const brandSubtitle = fields.brandSubtitle?.value ?? brandDefaults.brandSubtitle;
  const brandMark = fields.brandMark?.value ?? brandDefaults.brandMark;
  const brandLogo = fields.brandLogo?.value ?? null;
  const brandMarkImage = fields.brandMarkImage?.value ?? null;
  const resolvedBrandImage = brandLogo ?? brandMarkImage;
  const useBrandLogo = Boolean(brandLogo);

  return {
    brandName,
    brandSubtitle,
    brandMark,
    brandLogo,
    brandMarkImage,
    resolvedBrandImage,
    useBrandLogo,
  };
};

type NavbarProps = {
  rendering: ComponentRendering;
};

export function Navbar({ rendering }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useAtom(themeModeAtom);

  const toggleTheme = () => setThemeMode(themeMode === 'dark' ? 'light' : 'dark');

  const fields = (rendering.fields ?? {}) as unknown as NavbarFields;

  const {
    brandName,
    brandSubtitle,
    brandMark,
    brandLogo,
    brandMarkImage,
  } = resolveBrandFields(fields);

  const navLinks: NavLinkValue[] = fields.navLinks?.value ?? [
    { label: 'Schedule', href: '/schedule' },
    { label: 'Roster', href: '/roster' },
    { label: 'Results', href: '/results' },
    { label: 'News', href: '/news' },
    { label: 'Contact', href: '/contact' },
  ];

  const fourthAndOneHref = fields.fourthAndOneHref?.value ?? '/fourth-and-1';
  const fourthAndOneLabel = fields.fourthAndOneLabel?.value ?? '4th&1';
  const fourthAndOneLogo = fields.fourthAndOneLogo?.value ?? {
    src: '/images/logo-4th-and-1-v3.svg',
    alt: '4th&1 logo',
    width: 24,
    height: 24,
  };
  const ticketsUrl = fields.ticketsUrl?.value ?? '';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <BrandIdentity
            variant="navbar"
            brandName={brandName}
            brandSubtitle={brandSubtitle}
            brandMark={brandMark}
            brandLogo={brandLogo}
            brandMarkImage={brandMarkImage}
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="font-display text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={fourthAndOneHref}
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 transition-colors hover:bg-primary/20"
            >
              <Image
                src={fourthAndOneLogo.src}
                alt={fourthAndOneLogo.alt}
                width={fourthAndOneLogo.width ?? 24}
                height={fourthAndOneLogo.height ?? 24}
                className="h-6 w-auto object-contain"
              />
              <span className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                {fourthAndOneLabel}
              </span>
            </Link>
          </li>
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {ticketsUrl ? (
            <a
              href={ticketsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card/40 px-3 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-primary/30 hover:bg-card"
              aria-label="Tickets"
            >
              <IoTicketSharp className="h-5 w-5" />
              <span className="font-display text-xs">Tickets</span>
            </a>
          ) : null}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/40 text-foreground transition-colors hover:border-primary/30 hover:bg-card"
            aria-label={themeMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {themeMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {ticketsUrl ? (
            <a
              href={ticketsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/40 text-foreground transition-colors hover:border-primary/30 hover:bg-card"
              aria-label="Tickets"
            >
              <IoTicketSharp className="h-5 w-5" />
            </a>
          ) : null}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/40 text-foreground transition-colors hover:border-primary/30 hover:bg-card"
            aria-label={themeMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {themeMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-6 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-display text-lg font-medium uppercase tracking-wider text-foreground transition-colors hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={fourthAndOneHref}
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src={fourthAndOneLogo.src}
                  alt={fourthAndOneLogo.alt}
                  width={fourthAndOneLogo.width ?? 28}
                  height={fourthAndOneLogo.height ?? 28}
                  className="h-7 w-auto object-contain"
                />
                <span className="font-display text-lg font-bold uppercase tracking-wider text-primary">
                  {fourthAndOneLabel}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
