import Image from "next/image";

export type BrandImageValue = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type MediaLike = {
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
  width?: number | null;
  height?: number | null;
};

type BrandIdentityProps = {
  brandName: string;
  brandSubtitle: string;
  brandMark: string;
  brandLogo?: BrandImageValue | MediaLike | string | null;
  brandMarkImage?: BrandImageValue | MediaLike | string | null;
  brandMoto?: string;
  variant?: "navbar" | "footer";
  showMoto?: boolean;
};

const normalizeImage = (
  value?: BrandImageValue | MediaLike | string | null
): BrandImageValue | null => {
  if (!value) return null;
  if (typeof value === "string") {
    return { src: value, alt: "Brand image" };
  }
  if ("src" in value && value.src) return value as BrandImageValue;
  if ("url" in value && value.url) {
    return {
      src: value.url,
      alt: value.alt ?? value.filename ?? "Brand image",
      width: value.width ?? undefined,
      height: value.height ?? undefined,
    };
  }
  return null;
};

export function BrandIdentity({
  brandName,
  brandSubtitle,
  brandMark,
  brandLogo,
  brandMarkImage,
  brandMoto,
  variant = "navbar",
  showMoto = false,
}: BrandIdentityProps) {
  const resolvedBrandImage = normalizeImage(brandLogo) ?? normalizeImage(brandMarkImage);
  const useBrandLogo = Boolean(brandLogo);

  const rowClassName =
    variant === "footer" ? "mb-4 flex items-center gap-3" : "flex items-center gap-3";

  const nameClassName =
    variant === "navbar"
      ? "font-display text-lg font-bold uppercase leading-tight tracking-wider text-foreground"
      : "font-display text-lg font-bold uppercase tracking-wider text-foreground";

  const subtitleClassName =
    "text-xs uppercase tracking-widest text-muted-foreground";

  const imageClassName = useBrandLogo
    ? "h-10 w-auto object-contain"
    : "h-10 w-10 rounded-full object-contain";

  return (
    <div>
      <div className={rowClassName}>
        {resolvedBrandImage ? (
          <Image
            src={resolvedBrandImage.src}
            alt={resolvedBrandImage.alt}
            width={resolvedBrandImage.width ?? 40}
            height={resolvedBrandImage.height ?? 40}
            className={imageClassName}
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="font-display text-lg font-bold text-primary-foreground">
              {brandMark}
            </span>
          </div>
        )}
        <div>
          <p className={nameClassName}>{brandName}</p>
          <p className={subtitleClassName}>{brandSubtitle}</p>
        </div>
      </div>
      {showMoto && brandMoto ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {brandMoto}
        </p>
      ) : null}
    </div>
  );
}
