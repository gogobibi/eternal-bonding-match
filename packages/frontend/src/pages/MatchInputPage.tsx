import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postMatch } from '../api/client'
import SectionCard from '../components/form/SectionCard'
import Field from '../components/form/Field'

function extractLinkId(input: string): string {
  const trimmed = input.trim()
  const match = trimmed.match(/\/share\/([a-f0-9-]+)/i)
  if (match) return match[1]
  return trimmed
}

export default function MatchInputPage() {
  const navigate = useNavigate()
  const [linkIdA, setLinkIdA] = useState('')
  const [linkIdB, setLinkIdB] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    const idA = extractLinkId(linkIdA)
    const idB = extractLinkId(linkIdB)
    if (!idA || !idB) return
    setLoading(true)
    setError(null)
    try {
      const { match_id } = await postMatch(idA, idB)
      navigate(`/result/${match_id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-6">
        <header className="text-center space-y-1">
          <p className="text-slate-500 text-xs tracking-[0.3em] uppercase">Match</p>
          <h1 className="text-2xl font-bold text-[var(--color-gold)]">매칭 시작</h1>
          <p className="text-slate-500 text-sm">두 프로필의 공유 링크를 입력해 주세요</p>
        </header>

        <SectionCard title="공유 링크 입력">
          <Field label="내 링크">
            <input
              type="text"
              value={linkIdA}
              onChange={e => setLinkIdA(e.target.value)}
              placeholder="링크 ID 또는 공유 URL 붙여넣기"
              className="w-full px-3 py-2 rounded-md bg-[var(--color-navy)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none text-sm"
            />
          </Field>
          <Field label="상대방 링크">
            <input
              type="text"
              value={linkIdB}
              onChange={e => setLinkIdB(e.target.value)}
              placeholder="링크 ID 또는 공유 URL 붙여넣기"
              className="w-full px-3 py-2 rounded-md bg-[var(--color-navy)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none text-sm"
            />
          </Field>
          {error && <p className="text-rose-600 text-sm">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading || !extractLinkId(linkIdA) || !extractLinkId(linkIdB)}
            className="w-full py-3 rounded-md bg-[var(--color-gold)] text-[var(--color-navy)] font-bold hover:bg-[var(--color-gold-light)] disabled:opacity-50 transition-colors"
          >
            {loading ? '매칭 중...' : '매칭 시작'}
          </button>
        </SectionCard>
      </div>
    </div>
  )
}
