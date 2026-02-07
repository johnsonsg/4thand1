import * as React from 'react';
import type { GetServerSideProps } from 'next';

type ThemeTokens = Record<string, string | undefined>;

type ThemeConfig = {
  light: ThemeTokens;
  dark: ThemeTokens;
};

const LIGHT_FIELDS = [
  'background',
  'foreground',
  'card',
  'cardForeground',
  'popover',
  'popoverForeground',
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'muted',
  'mutedForeground',
  'accent',
  'accentForeground',
  'destructive',
  'destructiveForeground',
  'border',
  'input',
  'ring',
  'radius',
] as const;

const DARK_FIELDS = [...LIGHT_FIELDS] as const;

const EMPTY_THEME: ThemeConfig = {
  light: {},
  dark: {},
};

export default function ThemeAdminPage() {
  const [theme, setTheme] = React.useState<ThemeConfig>(EMPTY_THEME);
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    fetch('/api/theme')
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setTheme(data as ThemeConfig);
      })
      .catch(() => {
        if (mounted) setStatus('Failed to load theme.');
      });

    return () => {
      mounted = false;
    };
  }, []);

  const updateField = (mode: 'light' | 'dark', key: string, value: string) => {
    setTheme((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [key]: value,
      },
    }));
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(theme),
      });
      if (!res.ok) throw new Error('Save failed');
      setStatus('Saved. Refresh any page to see updates.');
    } catch {
      setStatus('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Theme Admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Update theme tokens in HSL format (e.g. <span className="font-mono">43 90% 55%</span>). Use
        <span className="font-mono"> radius</span> for border radius (e.g. <span className="font-mono">0.5rem</span>).
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card/40 p-6">
          <h2 className="text-lg font-semibold">Light theme</h2>
          <div className="mt-4 grid gap-3">
            {LIGHT_FIELDS.map((field) => (
              <label key={field} className="grid gap-1 text-sm">
                <span className="text-muted-foreground">{field}</span>
                <input
                  value={theme.light?.[field] ?? ''}
                  onChange={(e) => updateField('light', field, e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder={field === 'radius' ? '0.5rem' : '43 90% 55%'}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/40 p-6">
          <h2 className="text-lg font-semibold">Dark theme</h2>
          <div className="mt-4 grid gap-3">
            {DARK_FIELDS.map((field) => (
              <label key={field} className="grid gap-1 text-sm">
                <span className="text-muted-foreground">{field}</span>
                <input
                  value={theme.dark?.[field] ?? ''}
                  onChange={(e) => updateField('dark', field, e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder={field === 'radius' ? '0.5rem' : '43 90% 55%'}
                />
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save theme'}
        </button>
        {status && <span className="text-sm text-muted-foreground">{status}</span>}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};
