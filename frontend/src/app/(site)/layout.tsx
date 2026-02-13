import type { Metadata } from 'next'
import type { ReactNode } from 'react'
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
      <body>
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
