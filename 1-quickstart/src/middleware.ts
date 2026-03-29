import { myiam } from '@/lib/myiam'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await myiam.getSession(request.cookies)
  if (!session) {
    console.log('[MyIAM] 인증되지 않은 접근:', request.nextUrl.pathname)
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
