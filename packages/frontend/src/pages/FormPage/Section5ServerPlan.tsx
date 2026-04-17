import SectionCard from '../../components/form/SectionCard'
import Field from '../../components/form/Field'
import OXTriState from '../../components/form/OXTriState'
import RadioGroup from '../../components/form/RadioGroup'
import { PLANS, type OxTri, type PlanType } from '../../constants/options'
import type { ProfileInput } from '../../types/api'

export default function Section5ServerPlan({
  data, onChange,
}: {
  data: ProfileInput
  onChange: (u: Partial<ProfileInput>) => void
}) {
  return (
    <SectionCard id="server" title="서버·언약 플랜" description="O 가능 · X 불가 · △ 협의">
      <Field label="서버 이동">
        <OXTriState
          value={data.server_move}
          onChange={(v: OxTri) => onChange({ server_move: v })}
        />
      </Field>

      <Field label="서버 초월">
        <OXTriState
          value={data.server_cross}
          onChange={(v: OxTri) => onChange({ server_cross: v })}
        />
      </Field>

      <Field label="언약 플랜">
        <RadioGroup
          options={PLANS}
          value={data.covenant_plan}
          onChange={(v: PlanType) => onChange({ covenant_plan: v })}
        />
      </Field>
    </SectionCard>
  )
}
