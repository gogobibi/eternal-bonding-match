import type { ReactNode } from 'react'

interface Props {
  label: string
  hint?: string
  trailing?: ReactNode
  children: ReactNode
}

export default function Field({ label, hint, trailing, children }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[var(--color-gold)] font-semibold text-sm tracking-wide">{label}</label>
        {trailing}
      </div>
      {hint && <p className="text-slate-500 text-xs">{hint}</p>}
      {children}
    </div>
  )
}
