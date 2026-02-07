import type { ReactNode } from 'react';
import Script from 'next/script';
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
  try {
    const stored = localStorage.getItem('site.themeMode');
    const mode = stored ? JSON.parse(stored) : 'dark';
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.style.colorScheme = mode;
  } catch (_) {}
})();`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
