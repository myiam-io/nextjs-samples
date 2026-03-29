import { myiam } from '@/lib/myiam'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await myiam.getSession(await cookies())
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({
    authenticated: true,
    expiresAt: session.expiresAt,
  })
}
