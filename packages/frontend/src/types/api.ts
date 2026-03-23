// ── Enum-like unions ──

export type ServerType = '카벙클' | '펜리르' | '초코보' | '모그리' | '톤베리';

export type CouplingType = 'BL' | 'GL' | 'HL';

export type RaceType =
  | '휴란'
  | '엘레젠'
  | '라라펠'
  | '미코테'
  | '루가딘'
  | '아우라'
  | '흐로스가르'
  | '비에라'
  | '가가'
  | '팝';

export type JobType =
  // Tank
  | '나이트'
  | '전사'
  | '암흑기사'
  | '건브레이커'
  // Healer
  | '백마도사'
  | '학자'
  | '점성술사'
  | '현자'
  // DPS Melee
  | '몽크'
  | '용기사'
  | '닌자'
  | '사무라이'
  | '파무어'
  // DPS Ranged
  | '음유시인'
  | '기공사'
  | '무도가'
  // DPS Magic
  | '흑마도사'
  | '소환사'
  | '적마도사'
  | '픽토맨서';

// ── JSON column item types ──

export interface CustomKeywordItem {
  id: string;
  text: string;
  emphasized: boolean;
}

export interface PlayStyleItem {
  id: string;
  text: string;
  emphasized: boolean;
}

// ── Profile types ──

export interface ProfileRow {
  profile_id: string;
  nickname: string;
  server: ServerType;
  me_gender: string;
  me_gender_custom: string;
  me_age: string[];
  me_weekday: string[];
  me_weekend: string[];
  you_gender: string;
  you_gender_custom: string;
  you_age: string[];
  you_weekday_any: number;
  you_weekday: string[];
  you_weekend_any: number;
  you_weekend: string[];
  coupling_priority: CouplingType[][];
  me_race: RaceType[];
  you_race: RaceType[];
  my_jobs: JobType[];
  my_selected: string[];
  my_custom: CustomKeywordItem[];
  you_contents_enabled: number;
  you_jobs: JobType[];
  you_selected: string[];
  you_custom: CustomKeywordItem[];
  play_styles: PlayStyleItem[];
  server_move: 'O' | 'X' | '△';
  server_cross: 'O' | 'X' | '△';
  covenant_plan: '스탠다드' | '골드' | '플래티넘' | '무관';
  extra_items: PlayStyleItem[];
  created_at: string;
}

export type ProfileInput = Partial<Omit<ProfileRow, 'profile_id' | 'created_at'>>;

// ── Request / Response types ──

export type CreateProfileRequest = ProfileInput;

export interface CreateProfileResponse {
  profile_id: string;
}

export interface CreateLinkRequest {
  profile_id: string;
}

export interface CreateLinkResponse {
  link_id: string;
  expires_at: string;
}

export interface GetLinkResponse {
  link_id: string;
  profile_id: string;
  expires_at: string;
  profile: ProfileRow;
}

export interface CreateMatchRequest {
  link_id_a: string;
  link_id_b: string;
}

export interface CreateMatchResponse {
  match_id: string;
}

export interface GetMatchResponse {
  match_id: string;
  score: number;
  analysis: string;
  comment: string;
  created_at: string;
}
