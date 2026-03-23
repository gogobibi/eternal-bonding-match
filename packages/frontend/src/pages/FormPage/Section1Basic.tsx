import type { ProfileInput } from '../../types/api'

const SERVERS = ['카벙클', '펜리르', '초코보', '모그리', '톤베리'] as const
const GENDERS = ['남', '여', '기타'] as const
const AGES = ['20대', '30대', '40대 이상', '무관'] as const
const TIMES = ['오전', '오후', '저녁', '새벽', '무관'] as const

function RadioGroup({ label, options, value, onChange }: {
  label: string
  options: readonly string[]
  value: string | undefined
  onChange: (v: string) => void
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

function ChipMultiSelect({ label, options, value, onChange }: {
  label: string
  options: readonly string[]
  value: string[] | undefined
  onChange: (v: string[]) => void
}) {
  const selected = value ?? []
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(v => v !== opt) : [...selected, opt])
  }
  return (
    <fieldset className="space-y-2">
      <legend className="text-[var(--color-gold)] font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded border transition-colors ${selected.includes(opt) ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]' : 'border-[var(--color-gold)]/40 hover:border-[var(--color-gold)]'}`}>
            {opt}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function GenderSelect({ label, genderKey, customKey, data, onChange }: {
  label: string
  genderKey: 'me_gender' | 'you_gender'
  customKey: 'me_gender_custom' | 'you_gender_custom'
  data: ProfileInput
  onChange: (u: Partial<ProfileInput>) => void
}) {
  return (
    <div className="space-y-2">
      <RadioGroup label={label} options={GENDERS} value={data[genderKey]} onChange={v => onChange({ [genderKey]: v })} />
      {data[genderKey] === '기타' && (
        <input type="text" placeholder="성별을 입력해 주세요"
          value={data[customKey] ?? ''}
          onChange={e => onChange({ [customKey]: e.target.value })}
          className="w-full px-3 py-2 rounded bg-[var(--color-navy-light)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none" />
      )}
    </div>
  )
}

function TimeSelect({ label, options, value, onChange, anyKey, anyValue, onAnyChange }: {
  label: string
  options: readonly string[]
  value: string[] | undefined
  onChange: (v: string[]) => void
  anyKey?: string
  anyValue?: boolean
  onAnyChange?: (v: boolean) => void
}) {
  return (
    <div className="space-y-2">
      {anyKey !== undefined && (
        <label className="flex items-center gap-2 text-[var(--color-gold)] font-semibold">
          {label}
          <button type="button" onClick={() => onAnyChange?.(!anyValue)}
            className={`ml-2 px-3 py-1 text-sm rounded border transition-colors ${anyValue ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]' : 'border-[var(--color-gold)]/40'}`}>
            무관
          </button>
        </label>
      )}
      {!anyValue && (
        <ChipMultiSelect label={anyKey === undefined ? label : ''} options={options} value={value} onChange={onChange} />
      )}
    </div>
  )
}

export default function Section1Basic({ data, onChange }: { data: ProfileInput; onChange: (u: Partial<ProfileInput>) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[var(--color-gold)] font-semibold">닉네임</label>
        <input type="text" placeholder="인게임 닉네임"
          value={data.nickname ?? ''}
          onChange={e => onChange({ nickname: e.target.value })}
          className="w-full px-3 py-2 rounded bg-[var(--color-navy-light)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none" />
      </div>

      <RadioGroup label="서버" options={SERVERS} value={data.server} onChange={v => onChange({ server: v as ProfileInput['server'] })} />

      <GenderSelect label="내 성별" genderKey="me_gender" customKey="me_gender_custom" data={data} onChange={onChange} />
      <GenderSelect label="원하는 상대 성별" genderKey="you_gender" customKey="you_gender_custom" data={data} onChange={onChange} />

      <ChipMultiSelect label="내 나이대" options={AGES} value={data.me_age} onChange={v => onChange({ me_age: v })} />
      <ChipMultiSelect label="원하는 나이대" options={AGES} value={data.you_age} onChange={v => onChange({ you_age: v })} />

      <ChipMultiSelect label="내 활동 시간 (평일)" options={TIMES} value={data.me_weekday} onChange={v => onChange({ me_weekday: v })} />
      <ChipMultiSelect label="내 활동 시간 (주말)" options={TIMES} value={data.me_weekend} onChange={v => onChange({ me_weekend: v })} />

      <TimeSelect label="원하는 상대 활동 시간 (평일)" options={TIMES} value={data.you_weekday} onChange={v => onChange({ you_weekday: v })}
        anyKey="you_weekday_any" anyValue={data.you_weekday_any === 1} onAnyChange={v => onChange({ you_weekday_any: v ? 1 : 0 })} />

      <TimeSelect label="원하는 상대 활동 시간 (주말)" options={TIMES} value={data.you_weekend} onChange={v => onChange({ you_weekend: v })}
        anyKey="you_weekend_any" anyValue={data.you_weekend_any === 1} onAnyChange={v => onChange({ you_weekend_any: v ? 1 : 0 })} />
    </div>
  )
}
