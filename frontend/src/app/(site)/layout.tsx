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
    <ClerkProvider signInUrl="/team-admin/sign-in" afterSignInUrl="/team-admin" afterSignUpUrl="/team-admin">
      <Providers>{children}</Providers>
    </ClerkProvider>
  )
}
