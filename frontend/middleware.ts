import { NextResponse } from 'next/server'

export function middleware(req: Request) {
  throw new Error('MIDDLEWARE IS RUNNING')
}

export const config = {
  matcher: ['/:path*'],
}
