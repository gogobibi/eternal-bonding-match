import SectionCard from '../../components/form/SectionCard'
import Field from '../../components/form/Field'
import RadioGroup from '../../components/form/RadioGroup'
import ChipMultiSelect from '../../components/form/ChipMultiSelect'
import {
  SERVERS, GENDERS_ME, GENDERS_YOU,
  AGE_CLASS, AGE_DECADES, TIMES,
  type ServerType,
} from '../../constants/options'
import type { ProfileInput } from '../../types/api'

interface Props {
  data: ProfileInput
  onChange: (u: Partial<ProfileInput>) => void
}

function GenderBlock({
  label, options, genderKey, customKey, data, onChange,
}: {
  label: string
  options: readonly string[]
  genderKey: 'me_gender' | 'you_gender'
  customKey: 'me_gender_custom' | 'you_gender_custom'
  data: ProfileInput
  onChange: (u: Partial<ProfileInput>) => void
}) {
  const current = data[genderKey]
  return (
    <Field label={label}>
      <div className="space-y-2">
        <RadioGroup
          options={options}
          value={current}
          onChange={v => onChange({ [genderKey]: v } as Partial<ProfileInput>)}
        />
        {current === '직접기입' && (
          <input
            type="text"
            placeholder="성별을 입력해 주세요"
            value={data[customKey] ?? ''}
            onChange={e => onChange({ [customKey]: e.target.value } as Partial<ProfileInput>)}
            className="w-full px-3 py-2 rounded-md bg-[var(--color-navy)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none text-sm"
          />
        )}
      </div>
    </Field>
  )
}

function AgeBlock({
  label, value, onChange,
}: {
  label: string
  value: string[] | undefined
  onChange: (v: string[]) => void
}) {
  const selected = value ?? []
  const ageClass = selected.find(s => (AGE_CLASS as readonly string[]).includes(s))
  const decades = selected.filter(s => (AGE_DECADES as readonly string[]).includes(s))

  const setClass = (v: string) => {
    const rest = selected.filter(s => !(AGE_CLASS as readonly string[]).includes(s))
    onChange([v, ...rest])
  }
  const setDecades = (v: string[]) => {
    onChange(ageClass ? [ageClass, ...v] : v)
  }

  return (
    <Field label={label}>
      <div className="space-y-3">
        <RadioGroup options={AGE_CLASS} value={ageClass} onChange={setClass} />
        <ChipMultiSelect options={AGE_DECADES} value={decades} onChange={setDecades} size="sm" />
      </div>
    </Field>
  )
}

function TimeBlock({
  label, value, onChange, anyValue, onAnyChange,
}: {
  label: string
  value: string[] | undefined
  onChange: (v: string[]) => void
  anyValue?: boolean
  onAnyChange?: (v: boolean) => void
}) {
  const toggleAny = onAnyChange
    ? (
      <button
        type="button"
        onClick={() => onAnyChange(!anyValue)}
        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
          anyValue
            ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]'
            : 'border-[var(--color-border-strong)] text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
        }`}
      >
        무관
      </button>
    )
    : undefined

  return (
    <Field label={label} trailing={toggleAny}>
      {!anyValue && (
        <ChipMultiSelect options={TIMES} value={value} onChange={onChange} size="sm" />
      )}
    </Field>
  )
}

export default function Section1Basic({ data, onChange }: Props) {
  return (
    <SectionCard id="basic" title="기본 정보" description="닉네임과 서버는 필수입니다">
      <Field label="닉네임 (최대 9자)">
        <input
          type="text"
          placeholder="인게임 닉네임"
          maxLength={9}
          value={data.nickname ?? ''}
          onChange={e => onChange({ nickname: e.target.value })}
          className="w-full px-3 py-2 rounded-md bg-[var(--color-navy)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none text-sm"
        />
      </Field>

      <Field label="서버">
        <RadioGroup
          options={SERVERS}
          value={data.server}
          onChange={v => onChange({ server: v as ServerType })}
        />
      </Field>

      <div className="grid md:grid-cols-2 gap-5">
        <GenderBlock
          label="ME · 성별"
          options={GENDERS_ME}
          genderKey="me_gender"
          customKey="me_gender_custom"
          data={data}
          onChange={onChange}
        />
        <GenderBlock
          label="YOU · 성별"
          options={GENDERS_YOU}
          genderKey="you_gender"
          customKey="you_gender_custom"
          data={data}
          onChange={onChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <AgeBlock label="ME · 나이대" value={data.me_age} onChange={v => onChange({ me_age: v })} />
        <AgeBlock label="YOU · 나이대" value={data.you_age} onChange={v => onChange({ you_age: v })} />
      </div>

      <div className="space-y-4">
        <p className="text-slate-500 text-xs tracking-wider uppercase">ME · 접속 시간</p>
        <div className="grid md:grid-cols-2 gap-5">
          <TimeBlock label="평일" value={data.me_weekday} onChange={v => onChange({ me_weekday: v })} />
          <TimeBlock label="주말" value={data.me_weekend} onChange={v => onChange({ me_weekend: v })} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-slate-500 text-xs tracking-wider uppercase">YOU · 접속 시간</p>
        <div className="grid md:grid-cols-2 gap-5">
          <TimeBlock
            label="평일"
            value={data.you_weekday}
            onChange={v => onChange({ you_weekday: v })}
            anyValue={data.you_weekday_any === 1}
            onAnyChange={v => onChange({ you_weekday_any: v ? 1 : 0 })}
          />
          <TimeBlock
            label="주말"
            value={data.you_weekend}
            onChange={v => onChange({ you_weekend: v })}
            anyValue={data.you_weekend_any === 1}
            onAnyChange={v => onChange({ you_weekend_any: v ? 1 : 0 })}
          />
        </div>
      </div>
    </SectionCard>
  )
}
