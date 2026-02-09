import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const indexRedirects: Record<string, string> = {
  '/demo': '/demo/alpha',
}

export default clerkMiddleware((auth, req) => {
  const target = indexRedirects[req.nextUrl.pathname]
  if (target) {
    const url = req.nextUrl.clone()
    url.pathname = target
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
