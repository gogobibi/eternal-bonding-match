import { useNavigate } from 'react-router-dom'

export default function Actions() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <button
        onClick={() => navigate('/match')}
        className="flex-1 py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-light)] transition-colors"
      >
        다시 매칭하기
      </button>
      <button
        onClick={() => navigate('/')}
        className="flex-1 py-3 rounded-lg border border-[var(--color-gold)]/50 text-[var(--color-gold)] font-semibold hover:bg-[var(--color-gold)]/10 transition-colors"
      >
        홈으로
      </button>
    </div>
  )
}
