import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SectionCard from '../components/form/SectionCard'

export default function SharePage() {
  const { linkId } = useParams<{ linkId: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/share/${linkId}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-6">
        <header className="text-center space-y-1">
          <p className="text-slate-500 text-xs tracking-[0.3em] uppercase">Share</p>
          <h1 className="text-2xl font-bold text-[var(--color-gold)]">시트가 생성되었어요</h1>
          <p className="text-slate-500 text-sm">상대에게 아래 링크를 공유하면 매칭을 시작할 수 있어요</p>
        </header>

        <SectionCard title="공유 링크">
          <div className="bg-[var(--color-navy)] border border-[var(--color-gold)]/30 rounded-md px-3 py-3 break-all text-sm text-slate-800 font-mono">
            {shareUrl}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-md bg-[var(--color-gold)] text-[var(--color-navy)] font-bold hover:bg-[var(--color-gold-light)] transition-colors"
            >
              {copied ? '복사 완료' : '링크 복사'}
            </button>
            <button
              onClick={() => navigate('/match')}
              className="flex-1 py-2.5 rounded-md border border-[var(--color-gold)]/60 text-[var(--color-gold)] font-bold hover:bg-[var(--color-gold)]/10 transition-colors"
            >
              매칭 시작하기
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
