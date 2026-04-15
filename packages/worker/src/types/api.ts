// ── Enum-like unions (mirror frontend types) ──

export type ServerType = '카벙클' | '펜리르' | '초코보' | '모그리' | '톤베리';
export type CouplingType = 'BL' | 'GL' | 'HL';
export type RaceType =
  | '휴란' | '엘레젠' | '라라펠' | '미코테'
  | '루가딘' | '아우라' | '흐로스가르' | '비에라';
export type JobType =
  | '나이트' | '전사' | '암흑기사' | '건브레이커'
  | '백마도사' | '학자' | '점성술사' | '현자'
  | '몽크' | '용기사' | '닌자' | '사무라이' | '파무어'
  | '음유시인' | '기공사' | '무도가'
  | '흑마도사' | '소환사' | '적마도사' | '픽토맨서';

export interface KeywordItem {
  id: string;
  text: string;
  emphasized: boolean;
}

// ── DB row shapes ──

export interface ProfileRow {
  profile_id: string;
  nickname: string | null;
  server: ServerType | null;
  me_gender: string | null;
  me_gender_custom: string | null;
  me_age: string | null;        // JSON text in D1
  me_weekday: string | null;
  me_weekend: string | null;
  you_gender: string | null;
  you_gender_custom: string | null;
  you_age: string | null;
  you_weekday_any: number;
  you_weekday: string | null;
  you_weekend_any: number;
  you_weekend: string | null;
  coupling_priority: string | null;
  me_race: string | null;
  you_race: string | null;
  my_jobs: string | null;
  my_selected: string | null;
  my_custom: string | null;
  you_contents_enabled: number;
  you_jobs: string | null;
  you_selected: string | null;
  you_custom: string | null;
  play_styles: string | null;
  server_move: string | null;
  server_cross: string | null;
  covenant_plan: string | null;
  extra_items: string | null;
  created_at: string;
}

export interface LinkRow {
  link_id: string;
  profile_id: string;
  created_at: string;
  expires_at: string;
}

export interface MatchRow {
  match_id: string;
  profile_a_id: string;
  profile_b_id: string;
  score: number;
  analysis: string | null;
  comment: string | null;
  created_at: string;
}

// ── JSON columns that need parse/stringify ──

export const JSON_COLUMNS: (keyof ProfileRow)[] = [
  'me_age', 'me_weekday', 'me_weekend',
  'you_age', 'you_weekday', 'you_weekend',
  'coupling_priority', 'me_race', 'you_race',
  'my_jobs', 'my_selected', 'my_custom',
  'you_jobs', 'you_selected', 'you_custom',
  'play_styles', 'extra_items',
];

export function parseJsonColumns(row: ProfileRow): Record<string, unknown> {
  const result: Record<string, unknown> = { ...row };
  for (const col of JSON_COLUMNS) {
    const val = result[col];
    if (typeof val === 'string') {
      try { result[col] = JSON.parse(val); } catch { /* keep as-is */ }
    }
  }
  return result;
}

// ── Request / Response types ──

export interface CreateProfileRequest {
  [key: string]: unknown;
}

export interface CreateLinkRequest {
  profile_id: string;
}

export interface CreateMatchRequest {
  link_id_a: string;
  link_id_b: string;
}
