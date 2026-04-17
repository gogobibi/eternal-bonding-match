import SectionCard from '../../components/form/SectionCard'
import EditableKeywordList from './EditableKeywordList'
import type { ProfileInput } from '../../types/api'

export default function Section4PlayStyle({
  data, onChange,
}: {
  data: ProfileInput
  onChange: (u: Partial<ProfileInput>) => void
}) {
  return (
    <SectionCard id="playstyle" title="플레이·교류 스타일">
      <EditableKeywordList
        items={data.play_styles ?? []}
        onChange={items => onChange({ play_styles: items })}
        placeholder="플레이 스타일을 입력해 주세요"
      />
    </SectionCard>
  )
}
