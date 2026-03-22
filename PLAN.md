# Eternal Bonding Match — 프로젝트 작업 계획

FF14 한국 서버 기반 영원한 서약 파트너 매칭 서비스.

## 서비스 개요

- 사용자 A: 성향 입력 → 공유 링크 생성
- 사용자 B: A의 링크 접속 → 자신의 링크 붙여넣기 → 매칭률 확인
- Claude API 기반 AI 매칭률 계산
- 설문 데이터: [eternal-bonding-sheet](https://github.com/gogobibi/eternal-bonding-sheet) 기반 (FF14 한국 서버)

## 아키텍처

- **Frontend**: Cloudflare Pages (React + Vite)
- **Backend**: Cloudflare Workers (Hono framework)
- **Database**: Cloudflare D1 (SQLite)
- **AI**: Claude API (Anthropic)

## 작업 리스트

### ✅ 작업 1: 프로젝트 기반 설정 (Infrastructure Setup)
- [x] Cloudflare Workers + Pages monorepo 구조 초기화
- [x] 개발 도구 설정 (Wrangler, TypeScript)
- [x] 환경 변수 및 시크릿 관리 구조 정의 (.dev.vars.example)

### 작업 2: 데이터베이스 스키마 설계 (D1 Database Schema)
- [ ] 성향 데이터 테이블 설계 (설문 6개 섹션 기반)
- [ ] 공유 링크 / 세션 테이블 설계
- [ ] 매칭 결과 캐싱 테이블 설계
- [ ] 마이그레이션 파일 작성

### 작업 3: 백엔드 API 개발 (Cloudflare Workers)
- [ ] 성향 데이터 저장 API (POST /profiles)
- [ ] 공유 링크 생성 API (POST /links)
- [ ] 링크 기반 프로필 조회 API (GET /profiles/:linkId)
- [ ] 매칭 요청 API (POST /match)
- [ ] 매칭 결과 조회 API (GET /match/:matchId)

### 작업 4: AI 매칭 에이전트 개발 (Claude API Integration)
- [ ] Cloudflare Workers에서 Claude API 호출 구현
- [ ] 매칭률 계산 프롬프트 설계
- [ ] 매칭 결과 구조화 (점수, 항목별 분석, 코멘트)

### 작업 5: 프론트엔드 개발 (Cloudflare Pages)
- [ ] 성향 입력 폼 구현 (6개 섹션, eternal-bonding-sheet 기반)
  - 개별 텍스트 입력란 제거 → 최하단 기타 영역으로 통합
- [ ] 공유 링크 생성 및 복사 UI
- [ ] 매칭 플로우 UI (B가 A 링크 + 자신 링크 입력)
- [ ] 매칭 결과 페이지 UI

### 작업 6: 배포 설정 (Deployment)
- [ ] Cloudflare Pages 배포 설정
- [ ] Cloudflare Workers 배포 설정
- [ ] D1 Database 프로덕션 설정
- [ ] GitHub Actions CI/CD 파이프라인

---

## 설문 데이터 구조 (eternal-bonding-sheet 기반)

| 섹션 | 항목 |
|------|------|
| 1. 기본 정보 | 닉네임, 서버(5개), 성별, 나이대, 접속 시간대(평일/주말) |
| 2. 캐릭터 | 이미지, 종족(20종), 커플링(BL/GL/HL), 원하는 커마 스타일 |
| 3. 컨텐츠 성향 | 주직(21개 직업), 컨텐츠(레이드/PVP/생산 등), 커스텀 키워드 |
| 4. 플레이 스타일 | 동적 항목 리스트 (강조 토글 포함) |
| 5. 서버 플랜 | 서버이동 여부, 크로스서버, 언약플랜 |
| 6. 기타 | 다중 항목 동적 추가 텍스트 입력창 |
