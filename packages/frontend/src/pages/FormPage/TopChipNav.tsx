import { useEffect, useState } from 'react'

export interface NavSection {
  id: string
  label: string
}

interface Props {
  sections: readonly NavSection[]
}

export default function TopChipNav({ sections }: Props) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? '')

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const visibility = new Map<string, number>()

    const pickActive = () => {
      let best: { id: string; ratio: number } | null = null
      for (const [id, ratio] of visibility) {
        if (!best || ratio > best.ratio) best = { id, ratio }
      }
      if (best && best.ratio > 0) setActive(best.id)
    }

    for (const { id } of sections) {
      const el = document.getElementById(id)
      if (!el) continue
      const io = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            visibility.set(entry.target.id, entry.intersectionRatio)
          }
          pickActive()
        },
        { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
      )
      io.observe(el)
      observers.push(io)
    }

    return () => observers.forEach(io => io.disconnect())
  }, [sections])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-[var(--color-bg)]/85 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {sections.map(s => {
          const on = active === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                on
                  ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border-strong)] text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
