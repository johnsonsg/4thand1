import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import '@/styles/globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '../providers'

export const metadata: Metadata = {
  title: '4thand1',
  description: 'A themeable, CMS-driven Next.js template.',
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
            try {
              const stored = window.localStorage.getItem('site.themeMode');
              const mode = stored ? JSON.parse(stored) : 'dark';
              const root = document.documentElement;
              root.classList.toggle('dark', mode === 'dark');
              root.style.colorScheme = mode;
            } catch (_) {}
          })();`}
        </Script>
      </head>

      <body>
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
