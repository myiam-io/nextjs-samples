import { myiam } from '@/lib/myiam'
import { MyiamApiError, type UserMeResponse } from '@myiam.io/web-sdk/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ApiTester from './api-tester'

export default async function ServerDashboardPage() {
  const cookieStore = await cookies()
  const session = await myiam.getSession(cookieStore)
  if (!session) redirect('/')

  let user: UserMeResponse | null = null
  let apiError: string | null = null
  try {
    user = await myiam.api.getUser({
      accessToken: session.accessToken,
    })
  } catch (err) {
    if (err instanceof MyiamApiError) {
      apiError = JSON.stringify(
        { status: err.status, code: err.code, message: err.message },
        null,
        2,
      )
    } else {
      apiError = String(err)
    }
  }

  return (
    <div>
      <h1>서버 대시보드</h1>
      {user ? (
        <>
          <p>사용자: {user.username}</p>
          <p>UID: {user.uid}</p>
        </>
      ) : (
        <>
          <p>Access Token: {session.accessToken.slice(0, 20)}...</p>
          {apiError && (
            <pre style={{ color: 'red' }}>getUser 에러:{'\n'}{apiError}</pre>
          )}
        </>
      )}
      <p>
        세션 만료:{' '}
        {new Date(session.expiresAt).toLocaleString('ko-KR')}
      </p>

      <ApiTester serviceUserUid={user?.uid} />

      <div>
        <a href="/api/auth/logout">로그아웃</a>
      </div>
    </div>
  )
}
