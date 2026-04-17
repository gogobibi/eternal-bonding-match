import type { ReactNode } from 'react'

interface Props {
  id?: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export default function SectionCard({ id, title, description, children, className = '' }: Props) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-5 shadow-sm ${className}`}
    >
      <header className="space-y-1 border-b border-[var(--color-border)] pb-3">
        <h2 className="text-[var(--color-gold)] text-lg font-bold tracking-wide">{title}</h2>
        {description && <p className="text-slate-500 text-xs">{description}</p>}
      </header>
      {children}
    </section>
  )
}
