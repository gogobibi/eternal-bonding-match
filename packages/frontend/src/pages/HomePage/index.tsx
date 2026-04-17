import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pruneExpired } from '../../lib/myLinks'
import MyLinksPanel from './MyLinksPanel'

export default function HomePage() {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    pruneExpired()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <button
        type="button"
        onClick={() => setPanelOpen(true)}
        aria-label="내 링크 관리"
        className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-[var(--color-gold)] hover:bg-[var(--color-surface)] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      <div className="w-full max-w-xl space-y-10">
        <div className="text-center space-y-3">
          <p className="text-slate-500 text-xs tracking-[0.4em] uppercase">Eternal Bonding Match</p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-[var(--color-gold)] tracking-wide"
            style={{ textShadow: '0 0 30px rgba(124,58,237,0.2)' }}
          >
            이터널 본딩 매칭 시트
          </h1>
          <p className="text-slate-700 text-base leading-relaxed">
            서로의 플레이 성향·컨텐츠·커플링 선호를 기록하고<br />
            AI가 두 프로필의 궁합을 분석해줍니다.
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-3 shadow-sm">
          <button
            onClick={() => navigate('/form')}
            className="w-full py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-navy)] font-bold text-base hover:bg-[var(--color-gold-light)] transition-colors"
          >
            내 시트 작성하기
          </button>
          <button
            onClick={() => navigate('/match')}
            className="w-full py-3 rounded-lg border border-[var(--color-gold)]/60 text-[var(--color-gold)] font-bold text-base hover:bg-[var(--color-gold)]/10 transition-colors"
          >
            매칭 결과 확인하기
          </button>
          <p className="text-slate-400 text-xs text-center pt-2">
            작성된 시트는 공유 링크로 전달되어 상대와 매칭할 수 있어요
          </p>
        </div>
      </div>

      <MyLinksPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  )
}
