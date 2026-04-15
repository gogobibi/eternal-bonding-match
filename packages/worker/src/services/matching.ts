import Anthropic from '@anthropic-ai/sdk'
import type { MatchResult } from '../types/api'

const SYSTEM_PROMPT = `당신은 파이널판타지14(FF14) "영원한 서약" 매칭 전문가입니다.
두 플레이어의 프로필을 분석하여 영원한 서약 파트너로서의 궁합을 평가합니다.

다음 항목을 우선순위 순서대로 비교 분석하세요:

1. **커플링 타입** (coupling_priority) — 상호 일치 여부. 불일치 시 큰 감점.
2. **성별 선호** (me_gender ↔ you_gender) — 상호 매칭 여부.
3. **서버** (server) — 동일 서버 보너스. server_move/server_cross 의사도 고려.
4. **접속 시간대** (me_weekday/me_weekend ↔ you_weekday/you_weekend) — 시간대 오버랩.
5. **직업 조합** (my_jobs ↔ you_jobs) — 상대가 원하는 직업과 내 직업 매칭.
6. **플레이 스타일** (play_styles) — 공통 항목 수, emphasized 항목 비교.
7. **종족 선호** (me_race ↔ you_race) — 상대가 원하는 종족과 내 종족 매칭.
8. **언약 플랜** (covenant_plan) — 유사도.
9. **기타** (extra_items, my_custom, you_custom) — 추가 선호사항.

응답은 반드시 아래 JSON 형식으로만 답하세요. JSON 외 다른 텍스트를 포함하지 마세요:
{ "score": 0-100, "analysis": "항목별 분석 (한국어, 줄바꿈 포함)", "comment": "한줄 요약 코멘트" }`

export async function analyzeMatch(
  profileA: Record<string, unknown>,
  profileB: Record<string, unknown>,
  apiKey: string,
): Promise<MatchResult> {
  const client = new Anthropic({ apiKey })

  const userPrompt = `다음 두 프로필을 비교하여 영원한 서약 궁합을 분석해주세요.

## 프로필 A
${JSON.stringify(profileA, null, 2)}

## 프로필 B
${JSON.stringify(profileB, null, 2)}

두 프로필의 궁합을 분석하고, JSON 형식으로 결과를 반환해주세요.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    temperature: 0.5,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = JSON.parse(text) as MatchResult

  return {
    score: Math.max(0, Math.min(100, Math.round(parsed.score))),
    analysis: parsed.analysis,
    comment: parsed.comment,
  }
}
