import type { ProfileInput } from '../../types/api'
import EditableKeywordList from './EditableKeywordList'

export default function Section4PlayStyle({ data, onChange }: { data: ProfileInput; onChange: (u: Partial<ProfileInput>) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[var(--color-gold)] font-semibold">플레이 스타일</h3>
      <EditableKeywordList
        items={data.play_styles ?? []}
        onChange={items => onChange({ play_styles: items })}
        placeholder="플레이 스타일을 입력해 주세요"
      />
    </div>
  )
}
