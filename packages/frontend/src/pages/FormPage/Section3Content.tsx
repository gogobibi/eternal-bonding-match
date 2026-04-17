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

  const jobLabel = prefix === 'my' ? '주 직업' : '선호 직업'
  const contentLabel = prefix === 'my' ? '즐기는 컨텐츠' : '함께 즐기고 싶은 컨텐츠'

  return (
    <div className="space-y-5">
      <Field label={jobLabel}>
        <div className="space-y-3">
          {(Object.entries(JOB_GROUPS) as [string, readonly string[]][]).map(([group, list]) => (
            <div key={group} className="space-y-1.5">
              <span className="text-slate-600 text-xs font-medium">{group}</span>
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

      <Field label={contentLabel}>
        <div className="space-y-3">
          {(Object.entries(CONTENT_GROUPS) as [string, readonly string[]][]).map(([group, list]) => (
            <div key={group} className="space-y-1.5">
              <span className="text-slate-600 text-xs font-medium">{group}</span>
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

      <Field label="키워드 추가">
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
  const youEnabled = data.you_contents_enabled === 1

  return (
    <SectionCard id="content" title="주 컨텐츠">
      <div className="space-y-3">
        <h3 className="text-[var(--color-primary)] font-bold text-sm tracking-[0.3em] uppercase border-b border-[var(--color-border)] pb-2">
          ME
        </h3>
        <ContentBlock prefix="my" data={data} onChange={onChange} />
      </div>

      <label className="flex items-center gap-2 pt-2 cursor-pointer">
        <input
          type="checkbox"
          checked={youEnabled}
          onChange={e => onChange({ you_contents_enabled: e.target.checked ? 1 : 0 })}
          className="w-4 h-4 accent-[var(--color-primary)]"
        />
        <span className="text-slate-700 text-sm">상대 선호도 설정</span>
      </label>

      {youEnabled && (
        <div className="space-y-3">
          <h3 className="text-[var(--color-primary)] font-bold text-sm tracking-[0.3em] uppercase border-b border-[var(--color-border)] pb-2">
            YOU
          </h3>
          <ContentBlock prefix="you" data={data} onChange={onChange} />
        </div>
      )}
    </SectionCard>
  )
}
