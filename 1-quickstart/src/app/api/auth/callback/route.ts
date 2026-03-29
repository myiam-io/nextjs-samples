import { myiam } from '@/lib/myiam'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  await myiam.handleCallback(request.nextUrl.searchParams, await cookies())
  redirect('/dashboard')
}
