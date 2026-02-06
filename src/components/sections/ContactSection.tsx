"use client";

import * as React from 'react';

export function ContactSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">Get in touch</p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">Contact</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            This is a starter contact page. Later, these fields can be managed in your CMS and rendered through the same layout pipeline.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Address</h2>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p>Westfield High School</p>
              <p>500 Eagles Way</p>
              <p>Westfield, TX 77024</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Email</h2>
            <p className="mt-3 text-sm">
              <a
                href="mailto:football@westfieldisd.org"
                className="font-display text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
              >
                football@westfieldisd.org
              </a>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Replace this with your real contact info when you’re ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
