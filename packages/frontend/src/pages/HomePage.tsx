import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-lg">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-gold)] tracking-wide" style={{ textShadow: '0 0 30px rgba(212,175,55,0.3)' }}>
          이터널 본딩 매칭
        </h1>
        <p className="text-slate-300 text-lg">당신의 이상형과의 연연 궁합을 확인하세요</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/form')}
            className="px-8 py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold text-lg hover:bg-[var(--color-gold-light)] transition-colors">
            내 프로필 작성하기
          </button>
          <button onClick={() => navigate('/match')}
            className="px-8 py-3 rounded-lg border-2 border-[var(--color-gold)] text-[var(--color-gold)] font-semibold text-lg hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)] transition-colors">
            매칭 확인하기
          </button>
        </div>
      </div>
    </div>
  )
}
