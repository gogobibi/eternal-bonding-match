import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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
      <div className="text-center space-y-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-[var(--color-gold)]">프로필이 생성되었습니다!</h1>
        <p className="text-slate-300">아래 링크를 상대방에게 공유하세요</p>
        <div className="bg-[var(--color-navy-light)] rounded-lg p-4 border border-[var(--color-gold)]/20 break-all text-sm text-slate-300">
          {shareUrl}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleCopy}
            className="px-6 py-2 rounded bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-light)] transition-colors">
            {copied ? '복사됨!' : '링크 복사하기'}
          </button>
          <button onClick={() => navigate('/match')}
            className="px-6 py-2 rounded border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)] transition-colors">
            매칭 확인하기
          </button>
        </div>
      </div>
    </div>
  )
}
