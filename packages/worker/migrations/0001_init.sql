-- ============================================================
-- eternal-bonding-match: Initial Schema Migration
-- Version: 0001
-- Date: 2026-03-22
-- Description: profiles, links, matches 테이블 생성
-- Compatible with: Cloudflare D1 (SQLite)
-- ============================================================

-- 프로필 테이블: 사용자 설문 응답 전체를 저장
CREATE TABLE IF NOT EXISTS profiles (
  -- PK & metadata
  profile_id TEXT NOT NULL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Section 1: 기본 정보 (나)
  nickname TEXT,
  server TEXT CHECK (server IS NULL OR server IN ('카벙클', '펜리르', '초코보', '모그리', '톤베리')),
  me_gender TEXT,
  me_gender_custom TEXT,
  me_age TEXT,             -- JSON: string[] | null, e.g. ["20대","30대"]
  me_weekday TEXT,         -- JSON: string[] | null
  me_weekend TEXT,         -- JSON: string[] | null

  -- Section 1: 기본 정보 (원하는 상대)
  you_gender TEXT,
  you_gender_custom TEXT,
  you_age TEXT,            -- JSON: string[] | null
  you_weekday_any INTEGER DEFAULT 0,
  you_weekday TEXT,        -- JSON: string[] | null
  you_weekend_any INTEGER DEFAULT 0,
  you_weekend TEXT,        -- JSON: string[] | null

  -- Section 2: 캐릭터
  coupling_priority TEXT,  -- JSON: CouplingType[][] | null, e.g. [["BL"],["GL"],[]]
  me_race TEXT,            -- JSON: RaceType[] | null
  you_race TEXT,           -- JSON: RaceType[] | null

  -- Section 3: 컨텐츠 성향 (나)
  my_jobs TEXT,            -- JSON: JobType[] | null
  my_selected TEXT,        -- JSON: string[] | null
  my_custom TEXT,          -- JSON: CustomKeywordItem[] | null [{id, text, emphasized}]

  -- Section 3: 컨텐츠 성향 (원하는 상대)
  you_contents_enabled INTEGER DEFAULT 1,
  you_jobs TEXT,           -- JSON: JobType[] | null
  you_selected TEXT,       -- JSON: string[] | null
  you_custom TEXT,         -- JSON: CustomKeywordItem[] | null

  -- Section 4: 플레이 스타일
  play_styles TEXT,        -- JSON: PlayStyleItem[] | null [{id, text, emphasized}]

  -- Section 5: 서버 플랜
  server_move TEXT CHECK (server_move IS NULL OR server_move IN ('O', 'X', '△')),
  server_cross TEXT CHECK (server_cross IS NULL OR server_cross IN ('O', 'X', '△')),
  covenant_plan TEXT CHECK (covenant_plan IS NULL OR covenant_plan IN ('스탠다드', '골드', '플래티넘', '무관')),

  -- Section 6: 기타 (play_styles와 동일한 구조)
  extra_items TEXT         -- JSON: [{id, text, emphasized}] | null
);

-- 링크 테이블: 프로필 공유 링크 관리
CREATE TABLE IF NOT EXISTS links (
  link_id TEXT NOT NULL PRIMARY KEY,
  profile_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(profile_id)
);

-- 매칭 테이블: 두 프로필 간 AI 매칭 결과 저장
CREATE TABLE IF NOT EXISTS matches (
  match_id TEXT NOT NULL PRIMARY KEY,
  profile_a_id TEXT NOT NULL,
  profile_b_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  analysis TEXT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_a_id) REFERENCES profiles(profile_id),
  FOREIGN KEY (profile_b_id) REFERENCES profiles(profile_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_links_profile_id ON links(profile_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile_a_id ON matches(profile_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile_b_id ON matches(profile_b_id);
