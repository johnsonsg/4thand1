"use client";

import * as React from 'react';
import type { ComponentRendering, Field } from '@/lib/types/cms';
import { ContactInfo } from '@/components/contact/ContactInfo';

type ContactSectionFields = {
  addressLine1?: Field<string>;
  addressLine2?: Field<string>;
  city?: Field<string>;
  state?: Field<string>;
  zip?: Field<string>;
  email?: Field<string>;
  phone?: Field<string>;
  contactSnippet?: Field<string>;
};

type ContactSectionProps = {
  rendering?: ComponentRendering;
};

export function ContactSection({ rendering }: ContactSectionProps) {
  const fields = (rendering?.fields ?? {}) as unknown as ContactSectionFields;
  const addressLine1 = fields.addressLine1?.value ?? '';
  const addressLine2 = fields.addressLine2?.value ?? '';
  const city = fields.city?.value ?? '';
  const state = fields.state?.value ?? '';
  const zip = fields.zip?.value ?? '';
  const email = fields.email?.value ?? '';
  const phone = fields.phone?.value ?? '';
  const contactSnippet = fields.contactSnippet?.value ?? '';

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.3em] text-primary">Get in touch</p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">Contact</h1>
          {contactSnippet ? (
            <p className="mt-3 max-w-2xl text-muted-foreground">{contactSnippet}</p>
          ) : null}
        </div>

        <ContactInfo
          layout="cards"
          addressLine1={addressLine1}
          addressLine2={addressLine2}
          city={city}
          state={state}
          zip={zip}
          email={email}
          phone={phone}
        />
      </div>
    </section>
  );
}
