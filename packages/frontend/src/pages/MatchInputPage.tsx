import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postMatch } from '../api/client'

export default function MatchInputPage() {
  const navigate = useNavigate()
  const [linkIdA, setLinkIdA] = useState('')
  const [linkIdB, setLinkIdB] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!linkIdA.trim() || !linkIdB.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { match_id } = await postMatch(linkIdA.trim(), linkIdB.trim())
      navigate(`/result/${match_id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-[var(--color-gold)] text-center">매칭 시작</h1>
        <div className="bg-[var(--color-navy-light)] rounded-lg p-6 border border-[var(--color-gold)]/20 space-y-4">
          <div className="space-y-2">
            <label className="text-[var(--color-gold)] text-sm font-semibold">내 링크 ID</label>
            <input type="text" value={linkIdA} onChange={e => setLinkIdA(e.target.value)} placeholder="링크 ID를 입력하세요"
              className="w-full px-3 py-2 rounded bg-[var(--color-navy)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[var(--color-gold)] text-sm font-semibold">상대방 링크 ID</label>
            <input type="text" value={linkIdB} onChange={e => setLinkIdB(e.target.value)} placeholder="상대방 링크 ID를 입력하세요"
              className="w-full px-3 py-2 rounded bg-[var(--color-navy)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button onClick={handleSubmit} disabled={loading || !linkIdA.trim() || !linkIdB.trim()}
            className="w-full py-2 rounded bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-light)] disabled:opacity-50 transition-colors">
            {loading ? '매칭 중...' : '매칭 시작'}
          </button>
        </div>
      </div>
    </div>
  )
}
