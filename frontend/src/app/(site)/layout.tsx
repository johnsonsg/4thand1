import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '../providers'

export const metadata: Metadata = {
  title: '4thand1',
  description: 'A themeable, CMS-driven Next.js template.',
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <Providers>{children}</Providers>
    </ClerkProvider>
  )
}
