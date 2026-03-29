import { myiam } from '@/lib/myiam'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = myiam.logout(request.nextUrl.origin, await cookies())
  redirect(url)
}
