# 작업 6: 배포 설정 (Deployment) — 상세 계획

## 현재 상태 요약

| 항목 | 상태 |
|------|------|
| wrangler.toml (Worker) | ✅ 기본 설정 있음, D1 바인딩 database_id 미설정 |
| wrangler pages deploy (Frontend) | ✅ 스크립트 있음 (`packages/frontend/package.json`) |
| D1 마이그레이션 | ✅ `0001_init.sql` 작성 완료 |
| GitHub Actions | ❌ `.github/` 폴더 없음 |
| 프로덕션 시크릿 | ❌ 미설정 |

---

## 단계별 작업

### Step 1: Cloudflare D1 프로덕션 DB 생성 (사용자 직접)

```bash
# Cloudflare 대시보드 또는 CLI에서 D1 데이터베이스 생성
wrangler d1 create eternal-bonding-db

# 출력된 database_id를 복사
```

- 출력된 `database_id`를 `packages/worker/wrangler.toml`에 반영

### Step 2: wrangler.toml 프로덕션 설정 보완

현재 설정에 추가 필요한 항목:

1. `database_id` 실제 값으로 교체
2. CORS 설정 — 프로덕션 도메인 추가 (현재 `localhost:5173` + `*.pages.dev`만 허용)

### Step 3: 프로덕션 시크릿 설정 (사용자 직접)

```bash
# Worker에 Claude API 키 설정
wrangler secret put ANTHROPIC_API_KEY
```

### Step 4: D1 마이그레이션 적용 (사용자 직접)

```bash
# 프로덕션 DB에 스키마 적용
wrangler d1 migrations apply eternal-bonding-db --remote
```

### Step 5: Worker 배포 (사용자 직접)

```bash
cd packages/worker
npm run deploy   # = wrangler deploy
```

### Step 6: Pages 배포 (사용자 직접)

```bash
cd packages/frontend
npm run build
npm run deploy   # = wrangler pages deploy dist --project-name eternal-bonding-match
```

- API 통신은 상대 경로 `/api` 사용 중 → Pages와 Worker를 같은 도메인으로 연결하거나, Worker URL로 프록시 설정 필요

### Step 7: Pages ↔ Worker 라우팅 연결 (방법 A — Pages Functions 프록시로 구현됨)

프론트엔드 `/api/*` 요청은 `packages/frontend/functions/api/[[path]].ts`에서 받아 Worker로 프록시합니다.

**필요한 설정 (Cloudflare Pages 프로젝트 대시보드 → Settings → Environment variables):**

| 변수 | 타입 | 값 예시 | 용도 |
|------|------|---------|------|
| `WORKER_URL` | Plaintext | `https://eternal-bonding-worker.<sub>.workers.dev` | 프록시 대상 Worker URL |
| `PROXY_SECRET` | Secret | 임의의 긴 랜덤 문자열 | Worker 직접 호출 차단용 공유 시크릿 |

**Worker 측 대응:**

```bash
# Pages에 설정한 것과 동일한 값으로 Worker secret 등록
cd packages/worker
wrangler secret put PROXY_SECRET
```

- Worker는 `PROXY_SECRET`이 설정되면 `X-Proxy-Secret` 헤더를 검증 → Pages Functions 경유 요청만 허용
- `PROXY_SECRET` 미설정 환경(로컬 개발)에서는 검증이 비활성화되어 Vite 프록시와 호환됨

**보안 체크:**
- Worker `workers.dev` URL이 공개되어 있어 직접 호출 가능 → `PROXY_SECRET`으로 차단
- SSRF 방지: 프록시 대상은 고정 환경변수(`WORKER_URL`)만 사용, 사용자 입력은 pathname/쿼리스트링만 forwarding
- Hop-by-hop 헤더(`Host`, `Connection` 등)는 프록시 시 제거

**대안 (사용 안 함): B. Custom Domain** — Pages와 Worker를 같은 커스텀 도메인에 붙이고 라우트 분리. 커스텀 도메인이 준비되면 전환 가능.

### Step 8: GitHub Actions CI/CD 파이프라인 (후순위 — 수동 배포 안정화 후)

필요한 GitHub Secrets (사용자가 직접 설정):

| Secret | 용도 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Workers/Pages 배포 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 리소스 접근 |

워크플로우 구성:

```
PR 생성/업데이트 시:
  → TypeScript 타입 체크 (worker + frontend)
  → 빌드 검증

main 머지 시:
  → Worker 배포 (wrangler deploy)
  → D1 마이그레이션 적용
  → Frontend 빌드 + Pages 배포
```

---

## 사용자가 직접 해야 하는 작업 체크리스트

- [ ] Cloudflare 계정 로그인 및 `wrangler login`
- [ ] D1 데이터베이스 생성 (`wrangler d1 create`)
- [ ] `database_id`를 `wrangler.toml`에 반영
- [ ] `wrangler secret put ANTHROPIC_API_KEY`
- [ ] D1 마이그레이션 적용 (`wrangler d1 migrations apply --remote`)
- [ ] Worker 배포 (`wrangler deploy`) → 배포 후 출력된 `workers.dev` URL 확인
- [ ] `PROXY_SECRET` 랜덤 생성 (예: `openssl rand -hex 32`)
- [ ] Worker에 `PROXY_SECRET` 등록 (`wrangler secret put PROXY_SECRET`)
- [ ] Pages 프로젝트 생성
- [ ] Pages 프로젝트 환경변수 설정: `WORKER_URL` (Plaintext), `PROXY_SECRET` (Secret — Worker와 동일 값)
- [ ] Pages 배포
- [ ] (후순위) GitHub Secrets 설정 (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)

## 에이전트가 할 수 있는 작업

- [x] wrangler.toml 프로덕션 CORS 설정 추가
- [x] Pages Functions 프록시 파일 작성 (`functions/api/[[path]].ts`)
- [x] Worker 공유 시크릿 검증 미들웨어 추가
- [ ] (후순위) GitHub Actions 워크플로우 파일 작성 (`.github/workflows/deploy.yml`)
