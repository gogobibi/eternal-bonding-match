import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SectionCard from '../components/form/SectionCard'
import { listMyLinks, type MyLinkEntry } from '../lib/myLinks'

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function formatExpiry(iso: string): { label: string; daysLeft: number } | null {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return null
  const d = new Date(t)
  const label = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())} 만료`
  const daysLeft = Math.max(0, Math.ceil((t - Date.now()) / (24 * 60 * 60 * 1000)))
  return { label: `${label} · D-${daysLeft}`, daysLeft }
}

export default function SharePage() {
  const { linkId } = useParams<{ linkId: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [entry, setEntry] = useState<MyLinkEntry | null>(null)

  useEffect(() => {
    if (!linkId) return
    const found = listMyLinks().find(e => e.link_id === linkId) ?? null
    setEntry(found)
  }, [linkId])

  const shareUrl = `${window.location.origin}/share/${linkId}`

  const expiry = useMemo(() => (entry ? formatExpiry(entry.expires_at) : null), [entry])

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
          {expiry && (
            <div className="inline-flex items-center gap-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/40 px-3 py-1 text-xs font-semibold">
              {expiry.label}
            </div>
          )}
          <div className="bg-[var(--color-navy)] border border-[var(--color-gold)]/30 rounded-md px-3 py-3 break-all text-sm text-slate-800 font-mono">
            {shareUrl}
          </div>
          {entry && entry.has_password === false && (
            <div className="rounded-md border border-amber-400/60 bg-amber-50 text-amber-800 px-3 py-2 text-xs leading-relaxed">
              수동 삭제가 불가합니다. 만료 시까지 링크가 유지됩니다.
            </div>
          )}
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
