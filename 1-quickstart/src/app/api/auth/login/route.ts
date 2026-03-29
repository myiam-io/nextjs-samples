import { myiam } from '@/lib/myiam'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const callbackUrl = `${request.nextUrl.origin}/api/auth/callback`
  const cookieStore = await cookies()
  const type = request.nextUrl.searchParams.get('type')
  const url =
    type === 'signup'
      ? await myiam.signup(callbackUrl, cookieStore)
      : await myiam.login(callbackUrl, cookieStore)
  redirect(url)
}
