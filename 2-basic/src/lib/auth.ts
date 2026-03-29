import { myiam } from '@/lib/myiam'
import { type MyiamSession } from '@myiam.io/web-sdk/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type AuthResult =
  | { session: MyiamSession; error?: never }
  | { session?: never; error: NextResponse }

export async function requireSession(): Promise<AuthResult> {
  const session = await myiam.getSession(await cookies())
  if (!session) {
    return {
      error: NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 },
      ),
    }
  }
  return { session }
}
