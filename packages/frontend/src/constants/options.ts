export const SERVERS = ['카벙클', '펜리르', '초코보', '모그리', '톤베리'] as const
export type ServerType = typeof SERVERS[number]

export const GENDERS_ME = ['남', '여', '직접기입'] as const
export const GENDERS_YOU = ['남', '여', '직접기입', '무관'] as const
export type GenderMe = typeof GENDERS_ME[number]
export type GenderYou = typeof GENDERS_YOU[number]

export const AGE_CLASS = ['미성년자', '성인'] as const
export const AGE_DECADES = ['10대', '20대', '30대', '40대', '50↑'] as const
export type AgeClass = typeof AGE_CLASS[number]
export type AgeDecade = typeof AGE_DECADES[number]

export const TIMES = ['아침', '오전', '오후', '저녁', '밤', '새벽'] as const
export type TimeSlot = typeof TIMES[number]

export const COUPLINGS = ['BL', 'GL', 'HL'] as const
export type CouplingType = typeof COUPLINGS[number]

export const RACES = [
  '남라펠', '여라펠',
  '남코테', '여코테',
  '남중휴', '남고휴', '여중휴', '여고휴',
  '남레젠', '여레젠',
  '남우라', '여우라',
  '남비에라', '여비에라',
  '남로스갈', '여로스갈',
  '남루가딘', '여루가딘',
] as const
export type RaceType = typeof RACES[number]

export const FANTASIA = ['O', 'X'] as const
export type FantasiaType = typeof FANTASIA[number]

export const JOB_GROUPS = {
  탱커: ['나이트', '전사', '암흑기사', '건브레이커'],
  힐러: ['백마도사', '학자', '점성술사', '현자'],
  근딜: ['몽크', '용기사', '닌자', '사무라이', '리퍼', '바이퍼'],
  원딜: ['음유시인', '기공사', '무도가'],
  마법딜: ['흑마도사', '소환사', '적마도사', '픽토맨서'],
} as const
export type JobGroup = keyof typeof JOB_GROUPS
export type JobType = typeof JOB_GROUPS[JobGroup][number]

export const CONTENT_GROUPS = {
  '일상·소셜': ['스샷', '만추', '컨하', '하우징', '탐험수첩'],
  '레이드·던전': ['무작', '레벨링', '딥던전', '돌발', '작마물', '고대무기', '특수필드', '환토벌전', '극만신', '영식', '절'],
  'PVP': ['전장', '크컨', '기공전'],
  '생활': ['채집', '제작', '터주', '먼바다', '고난도제작'],
  '기타': ['칭호·업적작', '골드소서', '마작'],
} as const
export type ContentGroup = keyof typeof CONTENT_GROUPS
export type ContentItem = typeof CONTENT_GROUPS[ContentGroup][number]

export const OX_TRI = ['O', 'X', '△'] as const
export type OxTri = typeof OX_TRI[number]

export const PLANS = ['스탠다드', '골드', '플래티넘', '무관'] as const
export type PlanType = typeof PLANS[number]
