import * as React from 'react';
import Image from 'next/image';

import MuiBackButton from '@/components/buttons/MuiBackButton';

export function FourthAndOneContent() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-6 py-12">
      <div className="relative mb-10">
        <div className="absolute -inset-8 rounded-3xl bg-primary/5 blur-2xl" />
        <Image
          src="/images/logo-4th-and-1.jpg"
          alt="4th&1 logo"
          width={320}
          height={320}
          className="relative h-64 w-64 rounded-2xl object-cover shadow-2xl shadow-primary/20 md:h-80 md:w-80"
          priority
        />
      </div>

      <h1 className="font-display text-5xl font-bold uppercase tracking-wider text-foreground md:text-7xl">4th&amp;1</h1>

      <p className="mt-4 max-w-md text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
        When it matters most, we convert.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <span className="h-px w-12 bg-primary/40" />
        <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Westfield Eagles</span>
        <span className="h-px w-12 bg-primary/40" />
      </div>

      <MuiBackButton />
    </div>
  );
}
