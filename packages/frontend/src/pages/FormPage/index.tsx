import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postProfile, postLink } from '../../api/client'
import type { ProfileInput } from '../../types/api'
import Section1Basic from './Section1Basic'
import Section2Character from './Section2Character'
import Section3Content from './Section3Content'
import Section4PlayStyle from './Section4PlayStyle'
import Section5ServerPlan from './Section5ServerPlan'
import Section6Extra from './Section6Extra'

const SECTION_TITLES = ['기본 정보', '캐릭터 성향', '콘텐츠', '플레이 스타일', '서버 & 플랜', '기타']

export default function FormPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<ProfileInput>({})
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange = (update: Partial<ProfileInput>) => setData(prev => ({ ...prev, ...update }))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const { profile_id } = await postProfile(data)
      const { link_id } = await postLink(profile_id)
      navigate(`/share/${link_id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const renderSection = () => {
    const props = { data, onChange }
    switch (step) {
      case 1: return <Section1Basic {...props} />
      case 2: return <Section2Character {...props} />
      case 3: return <Section3Content {...props} />
      case 4: return <Section4PlayStyle {...props} />
      case 5: return <Section5ServerPlan {...props} />
      case 6: return <Section6Extra {...props} />
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 py-8">
        <h1 className="text-2xl font-bold text-[var(--color-gold)] text-center">프로필 작성</h1>

        <div className="flex items-center justify-center gap-2">
          {SECTION_TITLES.map((title, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${i + 1 === step ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)]' : i + 1 < step ? 'border-[var(--color-gold)] text-[var(--color-gold)]' : 'border-slate-600 text-slate-500'}`}>
                {i + 1}
              </div>
              {i < SECTION_TITLES.length - 1 && <div className={`w-4 h-px ${i + 1 < step ? 'bg-[var(--color-gold)]' : 'bg-slate-600'}`} />}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-400">{step} / 6 — {SECTION_TITLES[step - 1]}</p>

        <div className="bg-[var(--color-navy-light)] rounded-lg p-6 border border-[var(--color-gold)]/20">
          {renderSection()}
        </div>

        {error && <p className="text-red-400 text-center text-sm">{error}</p>}

        <div className="flex justify-between">
          <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 1}
            className="px-6 py-2 rounded border border-[var(--color-gold)]/40 hover:border-[var(--color-gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            이전
          </button>
          {step < 6 ? (
            <button type="button" onClick={() => setStep(s => s + 1)}
              className="px-6 py-2 rounded bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-light)] transition-colors">
              다음
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading}
              className="px-6 py-2 rounded bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:bg-[var(--color-gold-light)] disabled:opacity-50 transition-colors">
              {loading ? '제출 중...' : '제출하기'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
