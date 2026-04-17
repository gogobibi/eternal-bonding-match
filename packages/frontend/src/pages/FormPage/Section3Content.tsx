import SectionCard from '../../components/form/SectionCard'
import Field from '../../components/form/Field'
import EditableKeywordList from './EditableKeywordList'
import { JOB_GROUPS, CONTENT_GROUPS, type JobType } from '../../constants/options'
import type { ProfileInput, KeywordItem } from '../../types/api'

function Chip({
  label, on, onClick,
}: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-md border transition-colors ${
        on
          ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]'
          : 'border-[var(--color-border-strong)] text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
      }`}
    >
      {label}
    </button>
  )
}

function ContentBlock({
  prefix, data, onChange,
}: {
  prefix: 'my' | 'you'
  data: ProfileInput
  onChange: (u: Partial<ProfileInput>) => void
}) {
  const jobsKey = `${prefix}_jobs` as 'my_jobs' | 'you_jobs'
  const selectedKey = `${prefix}_selected` as 'my_selected' | 'you_selected'
  const customKey = `${prefix}_custom` as 'my_custom' | 'you_custom'
  const jobs = (data[jobsKey] ?? []) as JobType[]
  const selected = (data[selectedKey] ?? []) as string[]
  const custom = (data[customKey] ?? []) as KeywordItem[]

  const toggleJob = (job: JobType) => {
    onChange({ [jobsKey]: jobs.includes(job) ? jobs.filter(j => j !== job) : [...jobs, job] })
  }
  const togglePreset = (p: string) => {
    onChange({ [selectedKey]: selected.includes(p) ? selected.filter(s => s !== p) : [...selected, p] })
  }

  return (
    <div className="space-y-5">
      <Field label={prefix === 'my' ? 'ME · 주 직업' : 'YOU · 선호 직업'}>
        <div className="space-y-3">
          {(Object.entries(JOB_GROUPS) as [string, readonly string[]][]).map(([group, list]) => (
            <div key={group} className="space-y-1.5">
              <span className="text-slate-500 text-xs tracking-wider uppercase">{group}</span>
              <div className="flex flex-wrap gap-1.5">
                {list.map(job => (
                  <Chip
                    key={job}
                    label={job}
                    on={jobs.includes(job as JobType)}
                    onClick={() => toggleJob(job as JobType)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Field>

      <Field label={prefix === 'my' ? 'ME · 즐기는 컨텐츠' : 'YOU · 함께 즐기고 싶은 컨텐츠'}>
        <div className="space-y-3">
          {(Object.entries(CONTENT_GROUPS) as [string, readonly string[]][]).map(([group, list]) => (
            <div key={group} className="space-y-1.5">
              <span className="text-slate-500 text-xs tracking-wider uppercase">{group}</span>
              <div className="flex flex-wrap gap-1.5">
                {list.map(item => (
                  <Chip
                    key={item}
                    label={item}
                    on={selected.includes(item)}
                    onClick={() => togglePreset(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Field>

      <Field label="키워드 추가" hint="프리셋에 없는 컨텐츠를 자유롭게 입력">
        <EditableKeywordList items={custom} onChange={items => onChange({ [customKey]: items })} />
      </Field>
    </div>
  )
}

export default function Section3Content({
  data, onChange,
}: {
  data: ProfileInput
  onChange: (u: Partial<ProfileInput>) => void
}) {
  return (
    <SectionCard id="content" title="주 컨텐츠" description="직업과 즐기는 컨텐츠를 알려주세요">
      <ContentBlock prefix="my" data={data} onChange={onChange} />

      <label className="flex items-center gap-3 pt-2 cursor-pointer">
        <input
          type="checkbox"
          checked={data.you_contents_enabled === 1}
          onChange={e => onChange({ you_contents_enabled: e.target.checked ? 1 : 0 })}
          className="w-4 h-4 accent-[var(--color-gold)]"
        />
        <span className="text-[var(--color-gold)] font-semibold text-sm">상대방 컨텐츠 선호도 지정</span>
      </label>

      {data.you_contents_enabled === 1 && (
        <div className="pt-2 border-t border-[var(--color-gold)]/15">
          <ContentBlock prefix="you" data={data} onChange={onChange} />
        </div>
      )}
    </SectionCard>
  )
}
