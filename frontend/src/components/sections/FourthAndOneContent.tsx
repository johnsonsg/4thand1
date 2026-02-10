import * as React from 'react';
import Image from 'next/image';

import MuiBackButton from '@/components/buttons/MuiBackButton';
import type { ComponentRendering, Field } from '@/lib/types/cms';

type ImageValue = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type FourthAndOneFields = {
  logo?: Field<ImageValue>;
  tagline?: Field<string>;
  teamName?: Field<string>;
};

type FourthAndOneContentProps = {
  rendering: ComponentRendering;
};

export function FourthAndOneContent({ rendering }: FourthAndOneContentProps) {
  const fields = (rendering.fields ?? {}) as unknown as FourthAndOneFields;

  const logo = fields.logo?.value ?? {
    src: '/images/logo-4th-and-1-v3.svg',
    alt: '4th&1 logo',
    width: 174,
    height: 240,
  };

  const tagline = fields.tagline?.value ?? 'When it matters most, we convert.';
  const teamName = fields.teamName?.value ?? 'Westfield Eagles';

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-6 py-12">
      <div className="relative mb-10">
        <div className="absolute -inset-8 rounded-3xl bg-primary/5 blur-2xl" />
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width ?? 174}
          height={logo.height ?? 240}
          className="relative h-64 w-auto object-contain shadow-2xl shadow-primary/20 md:h-80 md:w-auto"
          priority
        />
      </div>

      <p className="mt-4 max-w-md text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
        {tagline}
      </p>

      <div className="mt-8 flex items-center gap-3">
        <span className="h-px w-12 bg-primary/40" />
        <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">{teamName}</span>
        <span className="h-px w-12 bg-primary/40" />
      </div>

      <MuiBackButton />
    </div>
  );
}
