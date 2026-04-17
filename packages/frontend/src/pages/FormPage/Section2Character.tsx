import SectionCard from '../../components/form/SectionCard'
import Field from '../../components/form/Field'
import RadioGroup from '../../components/form/RadioGroup'
import ChipMultiSelect from '../../components/form/ChipMultiSelect'
import {
  COUPLINGS, RACES, FANTASIA,
  type CouplingType, type RaceType, type FantasiaType,
} from '../../constants/options'
import type { ProfileInput, RaceSelection } from '../../types/api'

const PRIORITIES = ['선택', '1순위', '2순위', '3순위'] as const

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

function normalizeRace(value: ProfileInput['me_race']): RaceSelection {
  if (!value) return { fantasia: null, races: [] }
  if (Array.isArray(value)) return { fantasia: null, races: value }
  return value
}

export default function Section2Character({
  data, onChange,
}: {
  data: ProfileInput
  onChange: (u: Partial<ProfileInput>) => void
}) {
  const priorities = data.coupling_priority ?? [[], [], []]
  const meRace = normalizeRace(data.me_race)
  const youRace = normalizeRace(data.you_race)

  const setMeRace = (patch: Partial<RaceSelection>) => {
    onChange({ me_race: { ...meRace, ...patch } })
  }
  const setYouRace = (patch: Partial<RaceSelection>) => {
    onChange({ you_race: { ...youRace, ...patch } })
  }

  return (
    <SectionCard id="character" title="커마·커플링">
      <Field label="커플링 선호 우선순위">
        <div className="space-y-2">
          {COUPLINGS.map(ct => {
            const currentPri = getPriority(ct, priorities)
            return (
              <div key={ct} className="flex items-center gap-3">
                <span className="w-10 font-semibold text-[var(--color-gold)]">{ct}</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRIORITIES.map((label, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChange({ coupling_priority: setPriority(ct, idx, priorities) })}
                      className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                        currentPri === idx
                          ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]'
                          : 'border-[var(--color-border-strong)] text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Field>

      <div className="grid md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-4">
          <h3 className="text-[var(--color-primary)] font-bold text-sm tracking-[0.3em] uppercase border-b border-[var(--color-border)] pb-2">
            ME
          </h3>
          <Field label="환상약 사용">
            <RadioGroup
              options={FANTASIA}
              value={meRace.fantasia ?? undefined}
              onChange={v => setMeRace({ fantasia: v as FantasiaType })}
            />
          </Field>
          <Field label="종족">
            <ChipMultiSelect
              options={RACES}
              value={meRace.races}
              onChange={v => setMeRace({ races: v as RaceType[] })}
              size="sm"
            />
          </Field>
        </div>

        <div className="space-y-4">
          <h3 className="text-[var(--color-primary)] font-bold text-sm tracking-[0.3em] uppercase border-b border-[var(--color-border)] pb-2">
            YOU
          </h3>
          <Field label="환상약 사용">
            <RadioGroup
              options={FANTASIA}
              value={youRace.fantasia ?? undefined}
              onChange={v => setYouRace({ fantasia: v as FantasiaType })}
            />
          </Field>
          <Field label="선호 종족">
            <ChipMultiSelect
              options={RACES}
              value={youRace.races}
              onChange={v => setYouRace({ races: v as RaceType[] })}
              size="sm"
            />
          </Field>
        </div>
      </div>
    </SectionCard>
  )
}
