'use client'

import { useState } from 'react'

export default function ApiTester({
  serviceUserUid,
}: {
  serviceUserUid?: string
}) {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function callApi(
    method: string,
    url: string,
    body?: Record<string, unknown>,
  ) {
    setLoading(true)
    setResult('')
    try {
      const res = await fetch(url, {
        method,
        ...(body && {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
      })
      const text = await res.text()
      let display: string
      try {
        display = JSON.stringify(JSON.parse(text), null, 2)
      } catch {
        display = text
      }
      setResult(`${res.status} ${res.statusText}\n\n${display}`)
    } catch (err) {
      setResult(String(err))
    } finally {
      setLoading(false)
    }
  }

  function callAction(type: string) {
    callApi('POST', '/api/myiam/user/action', {
      type,
      serviceUserUid,
      completeRedirectUrl: window.location.href,
    })
  }

  return (
    <div>
      <h2>API 테스트</h2>

      <div>
        <h3>세션 관리</h3>
        <button onClick={() => callApi('GET', '/api/auth/session')}>
          myiam.getSession() — 세션 조회
        </button><br />
        <button onClick={() => callApi('POST', '/api/auth/refresh')}>
          myiam.refreshSession() — 세션 갱신
        </button><br />

        <h3>토큰 API</h3>
        <button onClick={() => callApi('GET', '/api/myiam/token/info')}>
          GET /api/v0/token/info — 토큰 정보 조회
        </button><br />
        <button onClick={() => callApi('DELETE', '/api/myiam/token', {})}>
          POST /api/v0/token/delete — 토큰 삭제
        </button><br />

        <h3>사용자 API</h3>
        <button onClick={() => callApi('GET', '/api/myiam/user/me')}>
          GET /api/v0/user/me — 사용자 정보 조회
        </button><br />
        {serviceUserUid && (
          <>
            <h3>서비스 사용자 API</h3>
            <button onClick={() => callApi('GET', `/api/myiam/user/service?serviceUserUid=${serviceUserUid}`)}>
              GET /api/v0/service-user/get — 서비스 사용자 조회
            </button><br />
            <button onClick={() => callApi('GET', `/api/myiam/user/profile?serviceUserUid=${serviceUserUid}`)}>
              GET /api/v0/service-user/profile/get — 서비스 사용자 프로필 조회
            </button><br />

            <h3>사용자 동작 API</h3>
            <button onClick={() => callAction('deregister')}>
              POST /api/v0/user/prepare/deregister — 회원 탈퇴
            </button><br />
            <button onClick={() => callAction('set-password')}>
              POST /api/v0/user/prepare/set-password — 비밀번호 설정
            </button><br />
            <button onClick={() => callAction('reset-password')}>
              POST /api/v0/user/prepare/reset-password — 비밀번호 재설정
            </button><br />
            <button onClick={() => callAction('edit-profile')}>
              POST /api/v0/user/prepare/edit-profile — 프로필 수정
            </button><br />
            <button onClick={() => callAction('edit-email')}>
              POST /api/v0/user/prepare/edit-email — 이메일 수정
            </button><br />
            <button onClick={() => callAction('passkey')}>
              POST /api/v0/user/prepare/passkey — 패스키 관리
            </button><br />
          </>
        )}
      </div>

      <h3>결과 표시</h3>
      {loading ? (
        <p>요청 중...</p>
      ) : (
        <pre>{result || '버튼을 클릭하여 API를 호출하세요.'}</pre>
      )}
    </div>
  )
}
