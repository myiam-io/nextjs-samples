export default function HomePage() {
  return (
    <div>
      <h1>MyIAM Next.js</h1>
      <a href="/api/auth/login">로그인</a>
      {' | '}
      <a href="/api/auth/login?type=signup">회원가입</a>
    </div>
  )
}
