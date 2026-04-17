-- ============================================================
-- eternal-bonding-match: Link Lifecycle Migration
-- Version: 0002
-- Description: 링크 선택 비밀번호(password_hash/salt)와 expires_at 인덱스 추가
-- Compatible with: Cloudflare D1 (SQLite)
-- ============================================================

ALTER TABLE links ADD COLUMN password_hash TEXT;
ALTER TABLE links ADD COLUMN password_salt TEXT;

CREATE INDEX IF NOT EXISTS idx_links_expires_at ON links(expires_at);
