'use client'

import { useState } from 'react'

export default function TokenInfo() {
  const [result, setResult] = useState('')

  async function fetchTokenInfo() {
    setResult('요청 중...')
    const res = await fetch('/api/token/info')
    const text = await res.text()
    try {
      setResult(JSON.stringify(JSON.parse(text), null, 2))
    } catch {
      setResult(text)
    }
  }

  return (
    <div>
      <button onClick={fetchTokenInfo}>토큰 정보 조회</button>
      {result && <pre>{result}</pre>}
    </div>
  )
}
