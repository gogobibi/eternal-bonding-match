// ── Enum-like unions (single source of truth: constants/options.ts) ──

export type {
  ServerType,
  CouplingType,
  RaceType,
  JobType,
  FantasiaType,
  OxTri,
  PlanType,
} from '../constants/options';
import type {
  RaceType,
  CouplingType,
  JobType,
  FantasiaType,
  OxTri,
  PlanType,
  ServerType,
} from '../constants/options';

// ── JSON column item types ──

export interface KeywordItem {
  id: string;
  text: string;
  emphasized: boolean;
}

// ── Profile types ──

export interface RaceSelection {
  fantasia: FantasiaType | null;
  races: RaceType[];
}

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
  me_race: RaceSelection | RaceType[];
  you_race: RaceType[];
  my_jobs: JobType[];
  my_selected: string[];
  my_custom: KeywordItem[];
  you_contents_enabled: number;
  you_jobs: JobType[];
  you_selected: string[];
  you_custom: KeywordItem[];
  play_styles: KeywordItem[];
  server_move: OxTri;
  server_cross: OxTri;
  covenant_plan: PlanType;
  extra_items: KeywordItem[];
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
  analysis: string | null;
  comment: string | null;
  created_at: string;
  profile_a_nickname?: string | null;
  profile_a_server?: ServerType | null;
  profile_b_nickname?: string | null;
  profile_b_server?: ServerType | null;
}
