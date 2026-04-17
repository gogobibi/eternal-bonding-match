import { OX_TRI, type OxTri } from '../../constants/options'

interface Props {
  value: OxTri | undefined
  onChange: (v: OxTri) => void
}

const LABEL_MAP: Record<OxTri, string> = {
  O: '가능',
  X: '불가',
  '△': '협의',
}

export default function OXTriState({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {OX_TRI.map(opt => {
        const on = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 rounded-md border text-sm transition-colors flex items-center justify-center gap-2 ${
              on
                ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]'
                : 'border-[var(--color-border-strong)] text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            <span className="text-base font-bold">{opt}</span>
            <span className="text-xs opacity-80">{LABEL_MAP[opt]}</span>
          </button>
        )
      })}
    </div>
  )
}
