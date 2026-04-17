export interface ScoreTier {
  label: string
  sublabel: string
  color: string
  ringColor: string
  glow: string
}

export function getScoreTier(score: number): ScoreTier {
  if (score >= 90) {
    return {
      label: '운명의 상대',
      sublabel: '영원의 서약, 바로 그 인연입니다',
      color: 'text-violet-600',
      ringColor: 'stroke-violet-600',
      glow: '0 0 40px rgba(124,58,237,0.45)',
    }
  }
  if (score >= 70) {
    return {
      label: '완벽한 파트너',
      sublabel: '서로를 완성하는 궁합입니다',
      color: 'text-violet-500',
      ringColor: 'stroke-violet-500',
      glow: '0 0 30px rgba(139,92,246,0.4)',
    }
  }
  if (score >= 50) {
    return {
      label: '좋은 인연',
      sublabel: '마음을 나눌 수 있는 관계입니다',
      color: 'text-sky-600',
      ringColor: 'stroke-sky-600',
      glow: '0 0 24px rgba(2,132,199,0.3)',
    }
  }
  if (score >= 30) {
    return {
      label: '노력해볼 만한',
      sublabel: '서로를 알아가면 달라질 수 있어요',
      color: 'text-orange-500',
      ringColor: 'stroke-orange-500',
      glow: '0 0 20px rgba(249,115,22,0.3)',
    }
  }
  return {
    label: '도전 과제',
    sublabel: '쉽지 않은 길이지만 불가능은 아닙니다',
    color: 'text-rose-600',
    ringColor: 'stroke-rose-600',
    glow: '0 0 20px rgba(225,29,72,0.3)',
  }
}

const ICON_MAP: { keyword: string; icon: string }[] = [
  { keyword: '커플링', icon: '💞' },
  { keyword: '성별', icon: '⚧️' },
  { keyword: '서버', icon: '🌐' },
  { keyword: '시간', icon: '🕒' },
  { keyword: '직업', icon: '⚔️' },
  { keyword: '플레이', icon: '🎮' },
  { keyword: '종족', icon: '🧝' },
  { keyword: '언약', icon: '💎' },
  { keyword: '기타', icon: '✨' },
  { keyword: '추가', icon: '✨' },
]

export function getSectionIcon(title: string): string {
  for (const { keyword, icon } of ICON_MAP) {
    if (title.includes(keyword)) return icon
  }
  return '🔹'
}
