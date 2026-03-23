import type { ProfileInput, CouplingType, RaceType } from '../../types/api'

const COUPLING_TYPES: CouplingType[] = ['BL', 'GL', 'HL']
const PRIORITIES = ['선택', '1순위', '2순위', '3순위'] as const
const RACES: RaceType[] = ['휴란', '엘레젠', '라라펠', '미코테', '루가딘', '아우라', '흐로스가르', '비에라', '가가', '팝']

function getPriority(coupling: CouplingType, priorities: CouplingType[][]): number {
  for (let i = 0; i < priorities.length; i++) {
    if (priorities[i]?.includes(coupling)) return i + 1
  }
  return 0
}

function setPriority(coupling: CouplingType, priority: number, current: CouplingType[][]): CouplingType[][] {
  const result: CouplingType[][] = [[], [], []]
  for (let i = 0; i < 3; i++) {
    result[i] = (current[i] ?? []).filter(c => c !== coupling)
  }
  if (priority > 0) {
    result[priority - 1] = [...result[priority - 1], coupling]
  }
  return result
}

export default function Section2Character({ data, onChange }: { data: ProfileInput; onChange: (u: Partial<ProfileInput>) => void }) {
  const priorities = data.coupling_priority ?? [[], [], []]

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-[var(--color-gold)] font-semibold">커플링 성향 우선순위</legend>
        {COUPLING_TYPES.map(ct => {
          const currentPri = getPriority(ct, priorities)
          return (
            <div key={ct} className="flex items-center gap-3">
              <span className="w-12 font-medium">{ct}</span>
              <div className="flex gap-1">
                {PRIORITIES.map((label, idx) => (
                  <button key={idx} type="button" onClick={() => onChange({ coupling_priority: setPriority(ct, idx, priorities) })}
                    className={`px-3 py-1 text-sm rounded border transition-colors ${currentPri === idx ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]' : 'border-[var(--color-gold)]/40 hover:border-[var(--color-gold)]'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-[var(--color-gold)] font-semibold">내 종족</legend>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {RACES.map(race => {
            const selected = data.me_race?.includes(race)
            return (
              <button key={race} type="button"
                onClick={() => onChange({ me_race: selected ? (data.me_race ?? []).filter(r => r !== race) : [...(data.me_race ?? []), race] })}
                className={`px-3 py-2 rounded border text-sm transition-colors ${selected ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]' : 'border-[var(--color-gold)]/40 hover:border-[var(--color-gold)]'}`}>
                {race}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-[var(--color-gold)] font-semibold">원하는 종족</legend>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {RACES.map(race => {
            const selected = data.you_race?.includes(race)
            return (
              <button key={race} type="button"
                onClick={() => onChange({ you_race: selected ? (data.you_race ?? []).filter(r => r !== race) : [...(data.you_race ?? []), race] })}
                className={`px-3 py-2 rounded border text-sm transition-colors ${selected ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]' : 'border-[var(--color-gold)]/40 hover:border-[var(--color-gold)]'}`}>
                {race}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
