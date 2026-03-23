import type { ProfileInput, JobType, KeywordItem } from '../../types/api'
import EditableKeywordList from './EditableKeywordList'

const JOB_GROUPS: { label: string; jobs: JobType[] }[] = [
  { label: '탱커', jobs: ['나이트', '전사', '암흑기사', '건브레이커'] },
  { label: '힐러', jobs: ['백마도사', '학자', '점성술사', '현자'] },
  { label: '근딜', jobs: ['몽크', '용기사', '닌자', '사무라이', '파무어'] },
  { label: '원딜', jobs: ['음유시인', '기공사', '무도가'] },
  { label: '마법딜', jobs: ['흑마도사', '소환사', '적마도사', '픽토맨서'] },
]

const CONTENT_PRESETS = ['일반 던전', '극만신', '영웅 레이드', '절만신', '골드소서', '하우징', '패션체크', '낚시', '수집', 'RP', '데이트', '잡담/친목']

function JobSelect({ label, jobs, selected, onToggle }: {
  label: string; jobs: JobType[]; selected: JobType[]; onToggle: (j: JobType) => void
}) {
  return (
    <div className="space-y-1">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex flex-wrap gap-1">
        {jobs.map(job => (
          <button key={job} type="button" onClick={() => onToggle(job)}
            className={`px-3 py-1 text-sm rounded border transition-colors ${selected.includes(job) ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]' : 'border-[var(--color-gold)]/40 hover:border-[var(--color-gold)]'}`}>
            {job}
          </button>
        ))}
      </div>
    </div>
  )
}

function ContentBlock({ prefix, data, onChange }: {
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
    <div className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="text-[var(--color-gold)] font-semibold">{prefix === 'my' ? '내 직업군' : '상대 직업군'}</legend>
        {JOB_GROUPS.map(g => (
          <JobSelect key={g.label} label={g.label} jobs={g.jobs} selected={jobs} onToggle={toggleJob} />
        ))}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-[var(--color-gold)] font-semibold">{prefix === 'my' ? '즐기는 콘텐츠' : '상대가 즐겼으면 하는 콘텐츠'}</legend>
        <div className="flex flex-wrap gap-2">
          {CONTENT_PRESETS.map(p => (
            <button key={p} type="button" onClick={() => togglePreset(p)}
              className={`px-3 py-1 text-sm rounded border transition-colors ${selected.includes(p) ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]' : 'border-[var(--color-gold)]/40 hover:border-[var(--color-gold)]'}`}>
              {p}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <span className="text-[var(--color-gold)] font-semibold">커스텀 키워드</span>
        <EditableKeywordList items={custom} onChange={items => onChange({ [customKey]: items })} />
      </div>
    </div>
  )
}

export default function Section3Content({ data, onChange }: { data: ProfileInput; onChange: (u: Partial<ProfileInput>) => void }) {
  return (
    <div className="space-y-6">
      <ContentBlock prefix="my" data={data} onChange={onChange} />

      <div className="space-y-2">
        <label className="flex items-center gap-3 text-[var(--color-gold)] font-semibold cursor-pointer">
          <input type="checkbox" checked={data.you_contents_enabled === 1}
            onChange={e => onChange({ you_contents_enabled: e.target.checked ? 1 : 0 })}
            className="w-4 h-4 accent-[var(--color-gold)]" />
          상대방 콘텐츠 성향 설정하기
        </label>
      </div>

      {data.you_contents_enabled === 1 && (
        <ContentBlock prefix="you" data={data} onChange={onChange} />
      )}
    </div>
  )
}
