import type { ComponentRendering, Field } from '@/lib/types/cms';
import { BrandIdentity, type BrandImageValue } from '@/components/brand/BrandIdentity';

type FooterFields = {
  brandName?: Field<string>;
  brandSubtitle?: Field<string>;
  brandMark?: Field<string>;
  brandMoto?: Field<string>;
  brandLogo?: Field<BrandImageValue>;
  brandMarkImage?: Field<BrandImageValue>;
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
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Westfield High School</p>
              <p>500 Eagles Way</p>
              <p>Westfield, TX 77024</p>
              <p className="pt-2">
                <a
                  href="mailto:football@westfieldisd.org"
                  className="text-primary transition-colors hover:text-primary/80"
                >
                  football@westfieldisd.org
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2025 Westfield Eagles Football. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
