import SectionCard from '../../components/form/SectionCard'
import EditableKeywordList from './EditableKeywordList'
import type { ProfileInput } from '../../types/api'

export default function Section6Extra({
  data, onChange,
}: {
  data: ProfileInput
  onChange: (u: Partial<ProfileInput>) => void
}) {
  return (
    <SectionCard
      id="extra"
      title="그 외"
      description="자유롭게 하고 싶은 말을 적어주세요"
    >
      <EditableKeywordList
        items={data.extra_items ?? []}
        onChange={items => onChange({ extra_items: items })}
        placeholder="예: 보이스챗 환영, 초보자 환영..."
      />
    </SectionCard>
  )
}
