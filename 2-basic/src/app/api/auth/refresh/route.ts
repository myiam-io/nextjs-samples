import { myiam } from '@/lib/myiam'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await myiam.refreshSession(await cookies())
  if (!session) {
    return NextResponse.json(
      { error: '세션 갱신에 실패했습니다.' },
      { status: 401 },
    )
  }
  return NextResponse.json({ expiresAt: session.expiresAt })
}
