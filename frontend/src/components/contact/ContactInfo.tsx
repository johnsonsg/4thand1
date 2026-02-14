import * as React from "react";

export type ContactInfoProps = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  email?: string;
  phone?: string;
  layout?: "cards" | "list";
  className?: string;
  cardClassName?: string;
  headingClassName?: string;
  textClassName?: string;
  linkClassName?: string;
};

const buildAddressLines = ({
  addressLine1,
  addressLine2,
  city,
  state,
  zip,
}: Pick<ContactInfoProps, "addressLine1" | "addressLine2" | "city" | "state" | "zip">) => {
  const location = [city, state, zip].filter(Boolean).join(", ");

  return [addressLine1, addressLine2, location]
    .map((line) => line?.trim())
    .filter(Boolean) as string[];
};

export function ContactInfo({
  addressLine1,
  addressLine2,
  city,
  state,
  zip,
  email,
  phone,
  layout = "list",
  className,
  cardClassName,
  headingClassName,
  textClassName,
  linkClassName,
}: ContactInfoProps) {
  const addressLines = buildAddressLines({ addressLine1, addressLine2, city, state, zip });
  const hasAddress = addressLines.length > 0;
  const hasEmail = Boolean(email);
  const hasPhone = Boolean(phone);

  if (!hasAddress && !hasEmail && !hasPhone) return null;

  if (layout === "cards") {
    return (
      <div className={className ?? "grid gap-6 md:grid-cols-2"}>
        {hasAddress ? (
          <div className={cardClassName ?? "rounded-lg border border-border bg-card p-6"}>
            <h2
              className={
                headingClassName ??
                "font-display text-sm font-semibold uppercase tracking-wider text-foreground"
              }
            >
              Address
            </h2>
            <div className={textClassName ?? "mt-3 space-y-1 text-sm text-muted-foreground"}>
              {addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        ) : null}

        {hasEmail || hasPhone ? (
          <div className={cardClassName ?? "rounded-lg border border-border bg-card p-6"}>
            <h2
              className={
                headingClassName ??
                "font-display text-sm font-semibold uppercase tracking-wider text-foreground"
              }
            >
              Contact
            </h2>
            {hasEmail ? (
              <p className={textClassName ?? "mt-3 text-sm"}>
                <a
                  href={`mailto:${email}`}
                  className={
                    linkClassName ??
                    "font-display text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
                  }
                >
                  {email}
                </a>
              </p>
            ) : null}
            {hasPhone ? (
              <p className={textClassName ?? "mt-3 text-sm text-muted-foreground"}>{phone}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={className ?? "space-y-2 text-sm text-muted-foreground"}>
      {hasAddress ? (
        <div className={textClassName ?? "space-y-1"}>
          {addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}
      {hasEmail ? (
        <p>
          <a
            href={`mailto:${email}`}
            className={linkClassName ?? "text-primary transition-colors hover:text-primary/80"}
          >
            {email}
          </a>
        </p>
      ) : null}
      {hasPhone ? <p className={textClassName}>{phone}</p> : null}
    </div>
  );
}
