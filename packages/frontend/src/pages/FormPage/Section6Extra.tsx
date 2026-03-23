import type { ProfileInput } from '../../types/api'
import EditableKeywordList from './EditableKeywordList'

export default function Section6Extra({ data, onChange }: { data: ProfileInput; onChange: (u: Partial<ProfileInput>) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[var(--color-gold)] font-semibold">기타 하고 싶은 말</h3>
      <EditableKeywordList
        items={data.extra_items ?? []}
        onChange={items => onChange({ extra_items: items })}
        placeholder="자유롭게 입력해 주세요"
      />
    </div>
  )
}
