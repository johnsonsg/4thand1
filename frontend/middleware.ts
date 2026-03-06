import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const indexRedirects: Record<string, string> = {
  '/demo': '/demo/alpha',
}

export default clerkMiddleware((auth, req) => {
  if (req.nextUrl.pathname.startsWith('/team-admin') && !req.nextUrl.pathname.startsWith('/team-admin/sign-in')) {
    auth().protect();
  }

  const tenantFromQuery = req.nextUrl.searchParams.get('tenant')?.trim();
  const tenantFromCookie = req.cookies.get('tenantId')?.value?.trim();
  const tenantId = tenantFromQuery || tenantFromCookie;

  const target = indexRedirects[req.nextUrl.pathname]
  if (target) {
    const url = req.nextUrl.clone()
    url.pathname = target
    const res = NextResponse.redirect(url)
    if (tenantFromQuery) {
      res.cookies.set('tenantId', tenantFromQuery, { path: '/' })
    }
    return res
  }

  if (tenantId) {
    const headers = new Headers(req.headers)
    headers.set('x-tenant-id', tenantId)
    const res = NextResponse.next({ request: { headers } })
    if (tenantFromQuery) {
      res.cookies.set('tenantId', tenantFromQuery, { path: '/' })
    }
    return res
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
