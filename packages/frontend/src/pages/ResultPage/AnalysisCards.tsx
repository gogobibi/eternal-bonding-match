import { parseAnalysis } from '../../lib/parseAnalysis'
import SectionCard from './SectionCard'

interface Props {
  analysis: string | null
}

export default function AnalysisCards({ analysis }: Props) {
  if (!analysis) return null
  const sections = parseAnalysis(analysis)
  if (sections.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-[var(--color-gold)] font-semibold text-lg tracking-wide px-1">
        상세 분석
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {sections.map((section, i) => (
          <SectionCard key={`${i}-${section.title}`} section={section} index={i} />
        ))}
      </div>
    </div>
  )
}
