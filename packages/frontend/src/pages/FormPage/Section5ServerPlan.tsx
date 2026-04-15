import type { ProfileInput } from '../../types/api'

const MOVE_OPTIONS = ['O', 'X', '△'] as const
const PLAN_OPTIONS = ['스탠다드', '골드', '플래티넘', '무관'] as const

function RadioRow({ label, options, value, onChange }: {
  label: string; options: readonly string[]; value: string | undefined; onChange: (v: string) => void
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-[var(--color-gold)] font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <label key={opt} className={`cursor-pointer px-4 py-2 rounded border transition-colors ${value === opt ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]' : 'border-[var(--color-gold)]/40 hover:border-[var(--color-gold)]'}`}>
            <input type="radio" className="sr-only" checked={value === opt} onChange={() => onChange(opt)} />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function Section5ServerPlan({ data, onChange }: { data: ProfileInput; onChange: (u: Partial<ProfileInput>) => void }) {
  return (
    <div className="space-y-6">
      <RadioRow label="서버 이전 의향" options={MOVE_OPTIONS} value={data.server_move} onChange={v => onChange({ server_move: v as ProfileInput['server_move'] })} />
      <RadioRow label="크로스 서버 교류" options={MOVE_OPTIONS} value={data.server_cross} onChange={v => onChange({ server_cross: v as ProfileInput['server_cross'] })} />
      <RadioRow label="계약 플랜" options={PLAN_OPTIONS} value={data.covenant_plan} onChange={v => onChange({ covenant_plan: v as ProfileInput['covenant_plan'] })} />
    </div>
  )
}
