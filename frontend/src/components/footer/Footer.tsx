import type { ComponentRendering, Field } from '@/lib/types/cms';
import { BrandIdentity, type BrandImageValue } from '@/components/brand/BrandIdentity';
import { ContactInfo } from '@/components/contact/ContactInfo';

type FooterFields = {
  brandName?: Field<string>;
  brandSubtitle?: Field<string>;
  brandMark?: Field<string>;
  brandMoto?: Field<string>;
  brandLogo?: Field<BrandImageValue>;
  brandMarkImage?: Field<BrandImageValue>;
  addressLine1?: Field<string>;
  addressLine2?: Field<string>;
  city?: Field<string>;
  state?: Field<string>;
  zip?: Field<string>;
  email?: Field<string>;
  phone?: Field<string>;
};

type BrandFields = Pick<
  FooterFields,
  "brandName" | "brandSubtitle" | "brandMark" | "brandMarkImage" | "brandLogo"
>;

const brandDefaults = {
  brandName: "Westfield Eagles",
  brandSubtitle: "Football",
  brandMark: "W",
  brandMoto: "Building champions on and off the field since 1952. Home of the Eagles.",
};

const resolveBrandFields = (fields: BrandFields & Pick<FooterFields, "brandMoto">) => {
  const brandName = fields.brandName?.value ?? brandDefaults.brandName;
  const brandSubtitle = fields.brandSubtitle?.value ?? brandDefaults.brandSubtitle;
  const brandMark = fields.brandMark?.value ?? brandDefaults.brandMark;
  const brandLogo = fields.brandLogo?.value ?? null;
  const brandMarkImage = fields.brandMarkImage?.value ?? null;
  const brandMoto = fields.brandMoto?.value ?? brandDefaults.brandMoto;
  const resolvedBrandImage = brandLogo ?? brandMarkImage;
  const useBrandLogo = Boolean(brandLogo);

  return {
    brandName,
    brandSubtitle,
    brandMark,
    brandLogo,
    brandMarkImage,
    brandMoto,
    resolvedBrandImage,
    useBrandLogo,
  };
};

type FooterProps = {
  rendering?: ComponentRendering;
};

export function Footer({ rendering }: FooterProps) {
  const fields = (rendering?.fields ?? {}) as unknown as FooterFields;

  const {
    brandName,
    brandSubtitle,
    brandMark,
    brandLogo,
    brandMarkImage,
    brandMoto,
  } = resolveBrandFields(fields);

  const contact = {
    addressLine1: fields.addressLine1?.value ?? '',
    addressLine2: fields.addressLine2?.value ?? '',
    city: fields.city?.value ?? '',
    state: fields.state?.value ?? '',
    zip: fields.zip?.value ?? '',
    email: fields.email?.value ?? '',
    phone: fields.phone?.value ?? '',
  };

  const copyrightLabel = [brandName, brandSubtitle].filter(Boolean).join(' ');
  const copyrightYear = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-border bg-secondary/30 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <BrandIdentity
              variant="footer"
              showMoto
              brandName={brandName}
              brandSubtitle={brandSubtitle}
              brandMark={brandMark}
              brandLogo={brandLogo}
              brandMarkImage={brandMarkImage}
              brandMoto={brandMoto}
            />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Schedule", "Roster", "Results", "News", "Booster Club"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ContactInfo layout="list" {...contact} />
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {copyrightYear} {copyrightLabel}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
