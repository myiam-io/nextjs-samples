import { myiam } from '@/lib/myiam'
import { cookies } from 'next/headers'
import TokenInfo from './token-info'

export default async function Dashboard() {
  const session = (await myiam.getSession(await cookies()))!

  return (
    <div>
      <h1>대시보드</h1>
      <p>Access Token: {session.accessToken.slice(0, 20)}...</p>
      <p>세션 만료: {new Date(session.expiresAt).toLocaleString('ko-KR')}</p>
      <TokenInfo />
      <br />
      <a href="/api/auth/logout">로그아웃</a>
    </div>
  )
}
