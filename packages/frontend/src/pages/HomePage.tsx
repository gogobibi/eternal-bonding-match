import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
    </div>
  )
}
