import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMatch } from '../../api/client'
import type { GetMatchResponse } from '../../types/api'
import ScoreHero from './ScoreHero'
import ProfileSummary from './ProfileSummary'
import AnalysisCards from './AnalysisCards'
import Actions from './Actions'

const POLLING_INTERVAL_MS = 3000

export default function ResultPage() {
  const { matchId } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
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
        <div className="w-full max-w-md space-y-5 text-center">
          <div className="text-5xl">😞</div>
          <h2 className="text-[var(--color-gold)] text-xl font-semibold">매칭 결과를 불러올 수 없습니다</h2>
          <p className="text-rose-600 text-sm">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate('/match')}
              className="flex-1 py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-light)] transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 rounded-lg border border-[var(--color-gold)]/50 text-[var(--color-gold)] font-semibold hover:bg-[var(--color-gold)]/10 transition-colors"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!result || result.analysis === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[var(--color-gold)]/30 border-t-[var(--color-gold)] rounded-full animate-spin mx-auto" />
          <p className="text-[var(--color-gold)]">AI가 매칭 결과를 분석 중입니다...</p>
          <p className="text-slate-400 text-xs">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }

  const nameA = result.profile_a_nickname ?? '?'
  const nameB = result.profile_b_nickname ?? '?'

  return (
    <div className="min-h-screen py-10 px-4">
      <div
        className="w-full max-w-2xl mx-auto space-y-8"
        style={{ animation: 'heroFadeIn 0.6s ease-out' }}
      >
        <header className="text-center space-y-1">
          <p className="text-slate-500 text-xs tracking-[0.3em] uppercase">Eternal Bonding · Result</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-gold)] tracking-wide"
              style={{ textShadow: '0 0 24px rgba(124,58,237,0.2)' }}>
            {nameA}님과 {nameB}님의 매칭률!
          </h1>
        </header>

        <ScoreHero score={result.score} comment={result.comment} />

        <ProfileSummary
          nicknameA={result.profile_a_nickname}
          serverA={result.profile_a_server}
          nicknameB={result.profile_b_nickname}
          serverB={result.profile_b_server}
        />

        <AnalysisCards analysis={result.analysis} />

        <Actions />
      </div>
    </div>
  )
}
