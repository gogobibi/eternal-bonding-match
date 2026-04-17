import { useEffect, useState } from 'react'
import { deleteLink } from '../../api/client'
import { listMyLinks, pruneExpired, removeMyLink, type MyLinkEntry } from '../../lib/myLinks'

interface Props {
  open: boolean
  onClose: () => void
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function formatCreated(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return iso
  const d = new Date(t)
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

function daysLeft(expiresAt: string): number {
  const t = Date.parse(expiresAt)
  if (Number.isNaN(t)) return -1
  return Math.ceil((t - Date.now()) / (24 * 60 * 60 * 1000))
}

function isExpired(entry: MyLinkEntry): boolean {
  const t = Date.parse(entry.expires_at)
  if (Number.isNaN(t)) return true
  return t <= Date.now()
}

type RowState =
  | { kind: 'idle' }
  | { kind: 'input'; password: string; error: string | null; submitting: boolean }

export default function MyLinksPanel({ open, onClose }: Props) {
  const [entries, setEntries] = useState<MyLinkEntry[]>([])
  const [rowStates, setRowStates] = useState<Record<string, RowState>>({})
  const [banner, setBanner] = useState<{ kind: 'success' | 'info'; text: string } | null>(null)

  useEffect(() => {
    if (!open) return
    pruneExpired()
    setEntries(listMyLinks())
    setRowStates({})
    setBanner(null)
  }, [open])

  if (!open) return null

  const refresh = () => setEntries(listMyLinks())

  const setRow = (linkId: string, state: RowState) => {
    setRowStates(prev => ({ ...prev, [linkId]: state }))
  }

  const handleRemoveLocal = (linkId: string) => {
    removeMyLink(linkId)
    refresh()
    setBanner({ kind: 'info', text: '로컬 기록에서 제거했습니다.' })
  }

  const handleStartInput = (linkId: string) => {
    setRow(linkId, { kind: 'input', password: '', error: null, submitting: false })
  }

  const handleCancelInput = (linkId: string) => {
    setRow(linkId, { kind: 'idle' })
  }

  const handleSubmitDelete = async (linkId: string) => {
    const state = rowStates[linkId]
    if (!state || state.kind !== 'input') return
    if (!state.password) {
      setRow(linkId, { ...state, error: '비밀번호를 입력해 주세요' })
      return
    }
    setRow(linkId, { ...state, submitting: true, error: null })
    try {
      const result = await deleteLink(linkId, state.password)
      if (result.ok) {
        removeMyLink(linkId)
        refresh()
        setRow(linkId, { kind: 'idle' })
        setBanner({ kind: 'success', text: '삭제되었습니다 (프로필·매칭 포함)' })
        return
      }
      if (result.error === 'invalid_password') {
        setRow(linkId, { ...state, submitting: false, error: '비밀번호가 일치하지 않습니다' })
        return
      }
      if (result.error === 'password_not_set') {
        // Server says no password — flip the local entry to has_password=false view.
        setEntries(prev => prev.map(e => (e.link_id === linkId ? { ...e, has_password: false } : e)))
        setRow(linkId, { kind: 'idle' })
        setBanner({ kind: 'info', text: '비밀번호가 설정되지 않은 링크입니다. 3일 뒤 자동 삭제됩니다.' })
      }
    } catch (e) {
      setRow(linkId, { ...state, submitting: false, error: e instanceof Error ? e.message : '오류가 발생했습니다' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg max-h-[85vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-[var(--color-gold)] text-lg font-bold tracking-wide">내 링크 관리</h2>
            <p className="text-slate-500 text-xs">이 기기에 저장된 링크 목록입니다. 기기/브라우저를 바꾸면 초기화됩니다.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-[var(--color-gold)] text-xl leading-none px-2"
            aria-label="닫기"
          >
            ×
          </button>
        </header>

        {banner && (
          <div
            className={`px-5 py-2 text-xs ${
              banner.kind === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-sky-50 text-sky-800 border-b border-sky-200'
            }`}
          >
            {banner.text}
          </div>
        )}

        <div className="overflow-y-auto p-5 space-y-3">
          {entries.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-10">저장된 링크가 없습니다.</p>
          )}
          {entries.map(entry => {
            const expired = isExpired(entry)
            const d = daysLeft(entry.expires_at)
            const state = rowStates[entry.link_id] ?? { kind: 'idle' as const }
            return (
              <div
                key={entry.link_id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-800 font-semibold text-sm truncate">{entry.nickname}</span>
                      {expired && (
                        <span className="inline-flex items-center rounded-full bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5">
                          만료됨
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs">
                      생성 {formatCreated(entry.created_at)}
                      {!expired && ` · D-${Math.max(0, d)}`}
                    </p>
                  </div>
                </div>

                {expired && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveLocal(entry.link_id)}
                      className="text-xs px-3 py-1.5 rounded-md border border-[var(--color-border-strong)] text-slate-700 hover:bg-slate-100"
                    >
                      기록에서 제거
                    </button>
                  </div>
                )}

                {!expired && entry.has_password === false && (
                  <div className="space-y-2">
                    <p className="text-slate-500 text-xs">수동 삭제 불가 (비번 미설정)</p>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveLocal(entry.link_id)}
                        className="text-xs px-3 py-1.5 rounded-md border border-[var(--color-border-strong)] text-slate-700 hover:bg-slate-100"
                      >
                        로컬 기록에서만 제거
                      </button>
                    </div>
                  </div>
                )}

                {!expired && entry.has_password === true && state.kind === 'idle' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleStartInput(entry.link_id)}
                      className="text-xs px-3 py-1.5 rounded-md bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-light)]"
                    >
                      삭제
                    </button>
                  </div>
                )}

                {!expired && entry.has_password === true && state.kind === 'input' && (
                  <div className="space-y-2">
                    <input
                      type="password"
                      value={state.password}
                      onChange={e => setRow(entry.link_id, { ...state, password: e.target.value, error: null })}
                      placeholder="삭제 비밀번호 입력"
                      autoComplete="off"
                      className="w-full px-3 py-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none text-sm"
                    />
                    {state.error && <p className="text-rose-600 text-xs">{state.error}</p>}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleCancelInput(entry.link_id)}
                        disabled={state.submitting}
                        className="text-xs px-3 py-1.5 rounded-md border border-[var(--color-border-strong)] text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitDelete(entry.link_id)}
                        disabled={state.submitting}
                        className="text-xs px-3 py-1.5 rounded-md bg-rose-600 text-white font-semibold hover:bg-rose-500 disabled:opacity-50"
                      >
                        {state.submitting ? '삭제 중...' : '삭제'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
