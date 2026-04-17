import type { AnalysisSection } from '../../lib/parseAnalysis'
import { getSectionIcon } from '../../lib/scoreTier'

interface Props {
  section: AnalysisSection
  index: number
}

export default function SectionCard({ section, index }: Props) {
  const icon = getSectionIcon(section.title)
  const badge =
    section.passed === true
      ? { text: '✓', className: 'bg-emerald-50 text-emerald-600 border-emerald-200' }
      : section.passed === false
        ? { text: '✗', className: 'bg-rose-50 text-rose-600 border-rose-200' }
        : null

  return (
    <div
      className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm transition-all duration-300 hover:border-[var(--color-primary)]/50 hover:-translate-y-0.5"
      style={{
        animation: `fadeSlideUp 0.5s ease-out ${index * 0.08}s backwards`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0 mt-0.5" aria-hidden>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-[var(--color-gold)] font-semibold text-base">{section.title}</h3>
            {badge && (
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs font-bold ${badge.className}`}
              >
                {badge.text}
              </span>
            )}
          </div>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{section.body}</p>
        </div>
      </div>
    </div>
  )
}
