"use client";

import * as React from "react";
import { OrganizationSwitcher, UserButton, SignOutButton, useOrganization } from "@clerk/nextjs";

type TenantSettings = Record<string, any>;

type MediaUploadResult = {
  id: string;
  url?: string | null;
  filename?: string | null;
};

const inputClass =
  "w-full rounded-md border border-border bg-background/70 px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const cardClass = "rounded-2xl border border-border bg-card/70 p-6 shadow-sm";

function setByPath<T extends object>(target: T, path: string, value: any): T {
  const parts = path.split(".");
  const clone = Array.isArray(target) ? ([...target] as any) : { ...target };
  let current: any = clone;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    const next = current[key];
    current[key] = next && typeof next === "object" ? (Array.isArray(next) ? [...next] : { ...next }) : {};
    current = current[key];
  }

  current[parts[parts.length - 1]] = value;
  return clone;
}

function updateArrayItem(target: TenantSettings, path: string, index: number, value: any) {
  const current = path.split(".").reduce((acc: any, key) => (acc ? acc[key] : undefined), target) ?? [];
  const next = [...current];
  next[index] = value;
  return setByPath(target, path, next);
}

async function uploadMedia(file: File, alt: string): Promise<MediaUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("alt", alt || "Team upload");

  const res = await fetch("/team-admin/api/media", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Media upload failed");
  }

  const data = (await res.json()) as { media: MediaUploadResult };
  return data.media;
}

const MediaField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (next: string | null) => void;
}) => {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const media = await uploadMedia(file, label);
      onChange(media.id);
    } catch (err) {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={labelClass}>{label}</span>
        {value ? <span className="text-xs text-muted-foreground">Media ID: {value}</span> : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          aria-label={`${label} upload`}
          onChange={(event) => handleFile(event.target.files?.[0])}
          className="text-sm"
        />
        {uploading ? <span className="text-xs text-muted-foreground">Uploading...</span> : null}
        {error ? <span className="text-xs text-destructive">{error}</span> : null}
        {value ? (
          <button
            type="button"
            className="text-xs text-muted-foreground underline"
            onClick={() => onChange(null)}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default function TeamAdminApp() {
  const [tenant, setTenant] = React.useState<TenantSettings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const { organization } = useOrganization();

  const load = React.useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/team-admin/api/tenant");
      if (!res.ok) throw new Error("Failed to load tenant settings");
      const data = (await res.json()) as { tenant: TenantSettings };
      setTenant(data.tenant);
    } catch (err) {
      setStatus("Unable to load tenant settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const update = (path: string, value: any) => {
    if (!tenant) return;
    setTenant((prev) => (prev ? setByPath(prev, path, value) : prev));
  };

  const updateArray = (path: string, index: number, value: any) => {
    if (!tenant) return;
    setTenant((prev) => (prev ? updateArrayItem(prev, path, index, value) : prev));
  };

  const addArrayItem = (path: string, value: any) => {
    if (!tenant) return;
    const current = path.split(".").reduce((acc: any, key) => (acc ? acc[key] : undefined), tenant) ?? [];
    setTenant((prev) => (prev ? setByPath(prev, path, [...current, value]) : prev));
  };

  const removeArrayItem = (path: string, index: number) => {
    if (!tenant) return;
    const current = path.split(".").reduce((acc: any, key) => (acc ? acc[key] : undefined), tenant) ?? [];
    const next = current.filter((_item: any, idx: number) => idx !== index);
    setTenant((prev) => (prev ? setByPath(prev, path, next) : prev));
  };

  const save = async () => {
    if (!tenant) return;
    setSaving(true);
    setStatus(null);
    try {
      const payload = {
        brand: tenant.brand ?? {},
        nav: tenant.nav ?? {},
        metadata: tenant.metadata ?? {},
        contact: tenant.contact ?? {},
        hero: tenant.hero ?? {},
        theme: tenant.theme ?? {},
        stats: tenant.stats ?? {},
        schedule: tenant.schedule ?? {},
        players: tenant.players ?? [],
        news: tenant.news ?? [],
      };

      const res = await fetch("/team-admin/api/tenant", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus("Saved successfully.");
    } catch (err) {
      setStatus("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Loading team settings...
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 p-8 text-sm text-muted-foreground">
        {status ?? "No tenant settings found for this organization."}
      </div>
    );
  }

  const statsItems = tenant.stats?.items ?? [];
  const games = tenant.schedule?.games ?? [];
  const players = tenant.players ?? [];
  const news = tenant.news ?? [];

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-linear-to-br from-background via-background to-secondary/40 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Team Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">Manage your team site</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update branding, roster, news, and schedule for your fans.
          </p>
          <div className="mt-3 text-xs text-muted-foreground">
            <div>Organization ID: {organization?.id ?? "Not selected"}</div>
            <div>Tenant ID: {tenant.tenantId ?? "Not set"}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <OrganizationSwitcher />
          <UserButton />
          <SignOutButton redirectUrl="/team-admin/sign-in">
            <button type="button" className="rounded-md border border-border px-3 py-2 text-xs font-semibold">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </section>

      <section className={cardClass}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Brand Settings</h2>
            <p className="text-sm text-muted-foreground">Team identity shown across the site.</p>
          </div>
          <MediaField
            label="Brand Logo"
            value={tenant.brand?.brandLogo}
            onChange={(value) => update("brand.brandLogo", value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className={labelClass}>Brand Name</span>
            <input
              className={inputClass}
              value={tenant.brand?.brandName ?? ""}
              onChange={(event) => update("brand.brandName", event.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Brand Subtitle</span>
            <input
              className={inputClass}
              value={tenant.brand?.brandSubtitle ?? ""}
              onChange={(event) => update("brand.brandSubtitle", event.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Brand Mark</span>
            <input
              className={inputClass}
              value={tenant.brand?.brandMark ?? ""}
              onChange={(event) => update("brand.brandMark", event.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Brand Motto</span>
            <textarea
              className={`${inputClass} min-h-24`}
              value={tenant.brand?.brandMoto ?? ""}
              onChange={(event) => update("brand.brandMoto", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold">Tickets</h2>
        <div className="mt-4">
          <label className="space-y-1">
            <span className={labelClass}>Tickets URL</span>
            <input
              className={inputClass}
              value={tenant.nav?.ticketsUrl ?? ""}
              onChange={(event) => update("nav.ticketsUrl", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold">Metadata</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            ["metadata.teamName", "Team Name"],
            ["metadata.mascot", "Mascot"],
            ["metadata.sport", "Sport"],
          ].map(([path, label]) => (
            <label key={path} className="space-y-1">
              <span className={labelClass}>{label}</span>
              <input
                className={inputClass}
                value={path.split(".").reduce((acc: any, key) => acc?.[key], tenant) ?? ""}
                onChange={(event) => update(path, event.target.value)}
              />
            </label>
          ))}
          <label className="space-y-1 md:col-span-2">
            <span className={labelClass}>Description</span>
            <textarea
              className={`${inputClass} min-h-24`}
              value={tenant.metadata?.description ?? ""}
              onChange={(event) => update("metadata.description", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold">Contact Info</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1 md:col-span-2">
            <span className={labelClass}>Contact Intro</span>
            <textarea
              className={`${inputClass} min-h-24`}
              value={tenant.contact?.contactSnippet ?? ""}
              onChange={(event) => update("contact.contactSnippet", event.target.value)}
            />
          </label>
          {[
            ["contact.addressLine1", "Address Line 1"],
            ["contact.addressLine2", "Address Line 2"],
            ["contact.city", "City"],
            ["contact.state", "State"],
            ["contact.zip", "ZIP"],
            ["contact.email", "Email"],
            ["contact.phone", "Phone"],
          ].map(([path, label]) => (
            <label key={path} className="space-y-1">
              <span className={labelClass}>{label}</span>
              <input
                className={inputClass}
                value={path.split(".").reduce((acc: any, key) => acc?.[key], tenant) ?? ""}
                onChange={(event) => update(path, event.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className={cardClass}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Hero Settings</h2>
            <p className="text-sm text-muted-foreground">Front page hero messaging and imagery.</p>
          </div>
          <MediaField
            label="Hero Background"
            value={tenant.hero?.backgroundImage}
            onChange={(value) => update("hero.backgroundImage", value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["hero.season", "Season Label"],
            ["hero.headline", "Headline"],
          ].map(([path, label]) => (
            <label key={path} className="space-y-1">
              <span className={labelClass}>{label}</span>
              <input
                className={inputClass}
                value={path.split(".").reduce((acc: any, key) => acc?.[key], tenant) ?? ""}
                onChange={(event) => update(path, event.target.value)}
              />
            </label>
          ))}
          <label className="space-y-1 md:col-span-2">
            <span className={labelClass}>Hero Description</span>
            <textarea
              className={`${inputClass} min-h-24`}
              value={tenant.hero?.heroDescription ?? ""}
              onChange={(event) => update("hero.heroDescription", event.target.value)}
            />
          </label>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className={labelClass}>Primary CTA Label</span>
            <input
              className={inputClass}
              value={tenant.hero?.primaryCtaLabel ?? ""}
              onChange={(event) => update("hero.primaryCtaLabel", event.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Primary CTA Link</span>
            <input
              className={inputClass}
              value={tenant.hero?.primaryCtaHref ?? ""}
              onChange={(event) => update("hero.primaryCtaHref", event.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Primary CTA Background</span>
            <input
              className={inputClass}
              value={tenant.hero?.primaryCtaBackgroundColor ?? ""}
              onChange={(event) => update("hero.primaryCtaBackgroundColor", event.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Primary CTA Text</span>
            <input
              className={inputClass}
              value={tenant.hero?.primaryCtaTextColor ?? ""}
              onChange={(event) => update("hero.primaryCtaTextColor", event.target.value)}
            />
          </label>
          {[
            ["hero.secondaryCtaLabel", "Secondary CTA Label"],
            ["hero.secondaryCtaHref", "Secondary CTA Link"],
            ["hero.tertiaryCtaLabel", "Tertiary CTA Label"],
            ["hero.tertiaryCtaHref", "Tertiary CTA Link"],
            ["hero.quaternaryCtaLabel", "Quaternary CTA Label"],
            ["hero.quaternaryCtaHref", "Quaternary CTA Link"],
          ].map(([path, label]) => (
            <label key={path} className="space-y-1">
              <span className={labelClass}>{label}</span>
              <input
                className={inputClass}
                value={path.split(".").reduce((acc: any, key) => acc?.[key], tenant) ?? ""}
                onChange={(event) => update(path, event.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold">Theme Settings</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Light Mode</h3>
            {["primary", "secondary"].map((token) => (
              <label key={`light-${token}`} className="space-y-1">
                <span className={labelClass}>{token}</span>
                <input
                  className={inputClass}
                  value={tenant.theme?.light?.[token] ?? ""}
                  onChange={(event) => update(`theme.light.${token}`, event.target.value)}
                />
              </label>
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Dark Mode</h3>
            {["primary", "secondary"].map((token) => (
              <label key={`dark-${token}`} className="space-y-1">
                <span className={labelClass}>{token}</span>
                <input
                  className={inputClass}
                  value={tenant.theme?.dark?.[token] ?? ""}
                  onChange={(event) => update(`theme.dark.${token}`, event.target.value)}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className={labelClass}>Headshot Background</span>
            <input
              className={inputClass}
              value={tenant.theme?.headshots?.backgroundColor ?? ""}
              onChange={(event) => update("theme.headshots.backgroundColor", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold">Stats Bar</h2>
        <div className="mt-4 space-y-4">
          {statsItems.map((item: any, index: number) => (
            <div key={`stat-${index}`} className="grid gap-3 md:grid-cols-3">
              <input
                className={inputClass}
                placeholder="Value"
                value={item?.value ?? ""}
                onChange={(event) =>
                  updateArray("stats.items", index, { ...item, value: event.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Label"
                value={item?.label ?? ""}
                onChange={(event) =>
                  updateArray("stats.items", index, { ...item, label: event.target.value })
                }
              />
              <button
                type="button"
                className="text-xs text-destructive underline"
                onClick={() => removeArrayItem("stats.items", index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-semibold text-primary"
            onClick={() => addArrayItem("stats.items", { value: "", label: "" })}
          >
            + Add stat
          </button>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold">Schedule</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className={labelClass}>Season Label</span>
            <input
              className={inputClass}
              value={tenant.schedule?.seasonLabel ?? ""}
              onChange={(event) => update("schedule.seasonLabel", event.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Section Title</span>
            <input
              className={inputClass}
              value={tenant.schedule?.title ?? ""}
              onChange={(event) => update("schedule.title", event.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Record</span>
            <input
              className={inputClass}
              value={tenant.schedule?.record ?? ""}
              onChange={(event) => update("schedule.record", event.target.value)}
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className={labelClass}>Win Chip Background</span>
            <input
              className={inputClass}
              value={tenant.schedule?.winChipBackgroundColor ?? ""}
              onChange={(event) => update("schedule.winChipBackgroundColor", event.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Win Chip Text</span>
            <input
              className={inputClass}
              value={tenant.schedule?.winChipTextColor ?? ""}
              onChange={(event) => update("schedule.winChipTextColor", event.target.value)}
            />
          </label>
        </div>
        <div className="mt-6 space-y-4">
          {games.map((game: any, index: number) => (
            <div key={`game-${index}`} className="grid gap-3 md:grid-cols-6">
              <input
                className={inputClass}
                placeholder="Date & Time"
                value={game?.dateTime ?? ""}
                onChange={(event) =>
                  updateArray("schedule.games", index, { ...game, dateTime: event.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Opponent"
                value={game?.opponent ?? ""}
                onChange={(event) =>
                  updateArray("schedule.games", index, { ...game, opponent: event.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Location"
                value={game?.location ?? ""}
                onChange={(event) =>
                  updateArray("schedule.games", index, { ...game, location: event.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Status"
                value={game?.status ?? ""}
                onChange={(event) =>
                  updateArray("schedule.games", index, { ...game, status: event.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Result"
                value={game?.result ?? ""}
                onChange={(event) =>
                  updateArray("schedule.games", index, { ...game, result: event.target.value })
                }
              />
              <button
                type="button"
                className="text-xs text-destructive underline"
                onClick={() => removeArrayItem("schedule.games", index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-semibold text-primary"
            onClick={() =>
              addArrayItem("schedule.games", {
                dateTime: "",
                opponent: "",
                location: "Home",
                status: "upcoming",
                result: "",
                outcome: "W",
              })
            }
          >
            + Add game
          </button>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold">Players</h2>
        <div className="mt-4 space-y-6">
          {players.map((player: any, index: number) => (
            <div key={`player-${index}`} className="rounded-xl border border-border bg-background/60 p-4">
              <div className="grid gap-3 md:grid-cols-4">
                <input
                  className={inputClass}
                  placeholder="Name"
                  value={player?.name ?? ""}
                  onChange={(event) =>
                    updateArray("players", index, { ...player, name: event.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Number"
                  value={player?.number ?? ""}
                  onChange={(event) =>
                    updateArray("players", index, { ...player, number: event.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Position"
                  value={player?.position ?? ""}
                  onChange={(event) =>
                    updateArray("players", index, { ...player, position: event.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Year"
                  value={player?.year ?? ""}
                  onChange={(event) => updateArray("players", index, { ...player, year: event.target.value })}
                />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <input
                  className={inputClass}
                  placeholder="Position Group (comma-separated)"
                  value={(player?.positionGroup ?? []).join(", ")}
                  onChange={(event) =>
                    updateArray("players", index, {
                      ...player,
                      positionGroup: event.target.value
                        .split(",")
                        .map((item: string) => item.trim())
                        .filter(Boolean),
                    })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Stats"
                  value={player?.stats ?? ""}
                  onChange={(event) => updateArray("players", index, { ...player, stats: event.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Hudl URL"
                  value={player?.hudlUrl ?? ""}
                  onChange={(event) => updateArray("players", index, { ...player, hudlUrl: event.target.value })}
                />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <MediaField
                  label="Player Image"
                  value={player?.image}
                  onChange={(value) => updateArray("players", index, { ...player, image: value })}
                />
                <textarea
                  className={`${inputClass} min-h-24`}
                  placeholder="Bio"
                  value={player?.bio ?? ""}
                  onChange={(event) => updateArray("players", index, { ...player, bio: event.target.value })}
                />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Accolades (comma-separated)"
                  value={(player?.accolades ?? []).map((item: any) => item?.title).filter(Boolean).join(", ")}
                  onChange={(event) =>
                    updateArray("players", index, {
                      ...player,
                      accolades: event.target.value
                        .split(",")
                        .map((item: string) => item.trim())
                        .filter(Boolean)
                        .map((title: string) => ({ title })),
                    })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Sort Order"
                  value={player?.sortOrder ?? ""}
                  onChange={(event) =>
                    updateArray("players", index, {
                      ...player,
                      sortOrder: event.target.value ? Number(event.target.value) : undefined,
                    })
                  }
                />
              </div>
              <div className="mt-4 flex justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={Boolean(player?.spotlight)}
                    onChange={(event) =>
                      updateArray("players", index, { ...player, spotlight: event.target.checked })
                    }
                  />
                  Spotlight
                </label>
                <button
                  type="button"
                  className="text-xs text-destructive underline"
                  onClick={() => removeArrayItem("players", index)}
                >
                  Remove player
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-semibold text-primary"
            onClick={() => addArrayItem("players", { name: "", number: "", position: "" })}
          >
            + Add player
          </button>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold">News</h2>
        <div className="mt-4 space-y-6">
          {news.map((item: any, index: number) => (
            <div key={`news-${index}`} className="rounded-xl border border-border bg-background/60 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  className={inputClass}
                  placeholder="Title"
                  value={item?.title ?? ""}
                  onChange={(event) => updateArray("news", index, { ...item, title: event.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Category"
                  value={item?.category ?? ""}
                  onChange={(event) => updateArray("news", index, { ...item, category: event.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Author"
                  value={item?.author ?? ""}
                  onChange={(event) => updateArray("news", index, { ...item, author: event.target.value })}
                />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <textarea
                  className={`${inputClass} min-h-24`}
                  placeholder="Excerpt"
                  value={item?.excerpt ?? ""}
                  onChange={(event) => updateArray("news", index, { ...item, excerpt: event.target.value })}
                />
                <MediaField
                  label="News Image"
                  value={item?.image}
                  onChange={(value) => updateArray("news", index, { ...item, image: value })}
                />
              </div>
              <div className="mt-4">
                <label className="space-y-1">
                  <span className={labelClass}>Body (one paragraph per line)</span>
                  <textarea
                    className={`${inputClass} min-h-24`}
                    value={(item?.body ?? [])
                      .map((paragraph: any) => paragraph?.paragraph)
                      .filter(Boolean)
                      .join("\n\n")}
                    onChange={(event) =>
                      updateArray("news", index, {
                        ...item,
                        body: event.target.value
                          .split(/\n{2,}/)
                          .map((paragraph: string) => paragraph.trim())
                          .filter(Boolean)
                          .map((paragraph: string) => ({ paragraph })),
                      })
                    }
                  />
                </label>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  className="text-xs text-destructive underline"
                  onClick={() => removeArrayItem("news", index)}
                >
                  Remove article
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-semibold text-primary"
            onClick={() => addArrayItem("news", { title: "", category: "", author: "" })}
          >
            + Add article
          </button>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/70 p-4">
        <div className="text-sm text-muted-foreground">{status ?? "Ready to save changes."}</div>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70"
          disabled={saving}
          onClick={save}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </section>
    </div>
  );
}
