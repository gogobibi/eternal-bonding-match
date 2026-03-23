import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMatch } from '../api/client'
import type { GetMatchResponse } from '../types/api'

const POLLING_INTERVAL_MS = 3000

export default function ResultPage() {
  const { matchId } = useParams<{ matchId: string }>()
  const [result, setResult] = useState<GetMatchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!matchId) return
    let active = true

    const poll = async () => {
      try {
        const data = await getMatch(matchId)
        if (!active) return
        setResult(data)
        if (data.analysis === 'pending') {
          setTimeout(poll, POLLING_INTERVAL_MS)
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : '오류가 발생했습니다')
      }
    }

    poll()
    return () => { active = false }
  }, [matchId])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (!result || result.analysis === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[var(--color-gold)]/30 border-t-[var(--color-gold)] rounded-full animate-spin mx-auto" />
          <p className="text-[var(--color-gold)]">AI가 매칭 결과를 분석 중입니다...</p>
        </div>
      </div>
    )
  }

  const score = result.score
  const scoreColor = score >= 70 ? 'text-[var(--color-gold)]' : score >= 40 ? 'text-yellow-400' : 'text-red-400'
  const barColor = score >= 70 ? 'bg-[var(--color-gold)]' : score >= 40 ? 'bg-yellow-400' : 'bg-red-400'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-[var(--color-gold)] text-center">매칭 결과</h1>
        <div className="bg-[var(--color-navy-light)] rounded-lg p-6 border border-[var(--color-gold)]/20 space-y-6">
          <div className="text-center">
            <p className={`text-6xl font-bold ${scoreColor}`}>{score}</p>
            <p className="text-slate-400 text-sm mt-1">/ 100</p>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div className={`h-3 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${score}%` }} />
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-[var(--color-gold)] font-semibold mb-1">분석</h3>
              <p className="text-slate-300 text-sm whitespace-pre-wrap">{result.analysis}</p>
            </div>
            {result.comment && (
              <div>
                <h3 className="text-[var(--color-gold)] font-semibold mb-1">코멘트</h3>
                <p className="text-slate-300 text-sm whitespace-pre-wrap">{result.comment}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
