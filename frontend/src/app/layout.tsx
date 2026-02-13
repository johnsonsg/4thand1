import type { ReactNode } from 'react';
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const themeInit = `(() => {
    try {
      const stored = window.localStorage.getItem('site.themeMode');
      const mode = stored ? JSON.parse(stored) : 'dark';
      const root = document.documentElement;
      root.classList.toggle('dark', mode === 'dark');
      root.style.colorScheme = mode;
    } catch (_) {}
  })();`;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
