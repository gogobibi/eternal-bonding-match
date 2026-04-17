import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postProfile, postLink } from '../../api/client'
import type { ProfileInput } from '../../types/api'
import { saveMyLink } from '../../lib/myLinks'
import TopChipNav, { type NavSection } from './TopChipNav'
import Section1Basic from './Section1Basic'
import Section2Character from './Section2Character'
import Section3Content from './Section3Content'
import Section4PlayStyle from './Section4PlayStyle'
import Section5ServerPlan from './Section5ServerPlan'
import Section6Extra from './Section6Extra'

const SECTIONS: readonly NavSection[] = [
  { id: 'basic', label: '기본 정보' },
  { id: 'character', label: '커마·커플링' },
  { id: 'content', label: '주 컨텐츠' },
  { id: 'playstyle', label: '플레이 스타일' },
  { id: 'server', label: '서버·플랜' },
  { id: 'extra', label: '그 외' },
] as const

export default function FormPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<ProfileInput>({})
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange = (update: Partial<ProfileInput>) => setData(prev => ({ ...prev, ...update }))

  const handleSubmit = async () => {
    if (!data.nickname || !data.server) {
      setError('닉네임과 서버는 필수입니다')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { profile_id } = await postProfile(data)
      const trimmedPw = password.trim()
      const { link_id, expires_at } = await postLink(profile_id, trimmedPw || undefined)
      saveMyLink({
        link_id,
        profile_id,
        nickname: data.nickname,
        created_at: new Date().toISOString(),
        expires_at,
        has_password: !!trimmedPw,
      })
      navigate(`/share/${link_id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-2xl mx-auto px-4 pb-40">
        <header className="pt-8 pb-6 text-center space-y-1">
          <p className="text-slate-500 text-xs tracking-[0.3em] uppercase">Eternal Bonding</p>
          <h1 className="text-2xl font-bold text-[var(--color-gold)] tracking-wide"
              style={{ textShadow: '0 0 24px rgba(124,58,237,0.2)' }}>
            프로필 작성
          </h1>
          <p className="text-slate-500 text-xs">필수 항목은 링크 닉네임과 서버뿐. 나머지는 자유롭게 채워주세요.</p>
        </header>

        <TopChipNav sections={SECTIONS} />

        <div className="space-y-6 pt-6">
          <Section1Basic data={data} onChange={onChange} />
          <Section2Character data={data} onChange={onChange} />
          <Section3Content data={data} onChange={onChange} />
          <Section4PlayStyle data={data} onChange={onChange} />
          <Section5ServerPlan data={data} onChange={onChange} />
          <Section6Extra data={data} onChange={onChange} />
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-[var(--color-bg)]/90 backdrop-blur-md border-t border-[var(--color-border)]">
        <div className="w-full max-w-2xl mx-auto px-4 py-4 space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="ebm-delete-password" className="text-[var(--color-gold)] font-semibold text-sm tracking-wide">
                삭제 비밀번호 (선택)
              </label>
            </div>
            <input
              id="ebm-delete-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="링크를 수동으로 삭제할 때 사용합니다"
              autoComplete="new-password"
              className="w-full px-3 py-2 rounded-md bg-[var(--color-navy)] border border-[var(--color-gold)]/40 focus:border-[var(--color-gold)] outline-none text-sm"
            />
            <p className="text-slate-500 text-xs">미입력 시 수동 삭제가 불가하며, 3일 뒤 자동 삭제됩니다.</p>
          </div>
          {error && <p className="text-rose-600 text-sm text-center">{error}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-navy)] font-bold hover:bg-[var(--color-gold-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '제출 중...' : '제출하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
