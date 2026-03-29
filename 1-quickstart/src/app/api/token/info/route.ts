import { myiam } from '@/lib/myiam'
import { MyiamApiError } from '@myiam.io/web-sdk/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  let session = await myiam.getSession(cookieStore)
  if (!session) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  try {
    return NextResponse.json(await myiam.api.getTokenInfo(session.accessToken))
  } catch (err) {
    // 토큰 만료 시 세션 갱신 후 재시도
    if (err instanceof MyiamApiError && err.status === 401) {
      session = await myiam.refreshSession(cookieStore)
      if (!session) {
        return NextResponse.json({ error: '세션 만료' }, { status: 401 })
      }
      return NextResponse.json(await myiam.api.getTokenInfo(session.accessToken))
    }
    throw err
  }
}
