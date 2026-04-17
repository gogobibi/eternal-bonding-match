import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (password: string | undefined) => Promise<void>
}

export default function PasswordPromptModal({ open, onClose, onSubmit }: Props) {
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async (pw: string | undefined) => {
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(pw)
    } catch (e) {
      setSubmitting(false)
      setError(e instanceof Error ? e.message : '오류가 발생했습니다')
    }
  }

  const handleBackdropClick = () => {
    if (submitting) return
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ebm-password-modal-title"
      >
        <header className="flex items-start justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div>
            <h2
              id="ebm-password-modal-title"
              className="text-[var(--color-gold)] text-lg font-bold tracking-wide"
            >
              삭제 비밀번호 설정 (선택)
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              미입력 시 수동 삭제가 불가하며, 3일 뒤 자동 삭제됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-slate-500 hover:text-[var(--color-gold)] text-xl leading-none px-2 disabled:opacity-40"
            aria-label="닫기"
          >
            ×
          </button>
        </header>

        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label htmlFor="ebm-modal-password" className="text-slate-700 text-sm font-medium">
              비밀번호
            </label>
            <input
              id="ebm-modal-password"
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                if (error) setError(null)
              }}
              placeholder="링크를 수동으로 삭제할 때 사용합니다"
              autoComplete="new-password"
              disabled={submitting}
              className="w-full px-3 py-2 rounded-md bg-[var(--color-navy)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none text-sm disabled:opacity-50"
            />
            {error && <p className="text-rose-600 text-xs">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSubmit(undefined)}
              disabled={submitting}
              className="py-2.5 rounded-lg border border-[var(--color-border-strong)] text-slate-700 hover:bg-slate-100 text-sm font-medium disabled:opacity-50"
            >
              {submitting ? '생성 중...' : '비번 없이 생성'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(password.trim() || undefined)}
              disabled={submitting}
              className="py-2.5 rounded-lg bg-[var(--color-gold)] text-[var(--color-navy)] font-bold hover:bg-[var(--color-gold-light)] text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? '생성 중...' : '생성하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
