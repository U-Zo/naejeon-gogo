## Context

현재 데이터를 JSON 파일(`data/matches.json`, `data/members.json`)로 저장하고 있으며, Fly.io의 persistent volume에 의존한다. Fly.io 무료 체험은 7일/2시간 제한이라 지속 운영이 불가능하다. Repository 패턴이 이미 적용되어 있어(`IMatchRepository`, `IMemberRepository` 인터페이스) 구현체 교체가 용이하다.

데이터 모델:
- `Member`: id, name, mainPosition, subPositions, mmr, isTemporary, createdAt, streak
- `Match`: id, date, teamA(TeamSlot[]), teamB(TeamSlot[]), winner
- `TeamSlot`: memberId, position (Match 내 중첩 구조)

## Goals / Non-Goals

**Goals:**
- JSON 파일 저장소를 Turso(libSQL) DB로 교체하여 volume 의존성 제거
- Render 무료 웹서비스로 배포 전환
- 기존 Repository 인터페이스(`IMatchRepository`, `IMemberRepository`) 유지

**Non-Goals:**
- ORM 도입 (raw SQL로 충분)
- API 인터페이스 변경
- 로컬 개발 환경에서의 JSON Repository 유지 (Turso로 통일)
- 데이터 마이그레이션 자동화 스크립트 (수동 처리)

## Decisions

### 1. Turso 클라이언트: `@libsql/client`
- Turso 공식 클라이언트로, libSQL(SQLite 포크) 프로토콜 지원
- ORM 없이 raw SQL 사용 — 데이터 모델이 단순하고 쿼리가 CRUD뿐이므로 충분
- 대안: Drizzle ORM → 오버킬, better-sqlite3 → 로컬 파일 전용이라 Turso 원격 DB 미지원

### 2. DB 스키마: 정규화된 테이블 구조
- `members` 테이블: 모든 필드를 컬럼으로 매핑. `subPositions`는 JSON 문자열로 저장, `streak`도 JSON 문자열로 저장
- `matches` 테이블: id, date, winner 컬럼. `teamA`, `teamB`는 `match_slots` 테이블로 분리
- `match_slots` 테이블: matchId, team('A'|'B'), memberId, position
- 대안: Match의 teamA/teamB를 JSON 문자열로 저장 → 쿼리 유연성이 떨어지지만 현재 findAll/findById만 사용하므로 JSON 저장도 가능. 하지만 향후 확장성을 위해 정규화 선택

### 3. DB 초기화: 앱 시작 시 테이블 생성
- `CREATE TABLE IF NOT EXISTS` 사용
- 별도 마이그레이션 도구 불필요 — 테이블 3개뿐
- `db.ts` 파일에서 클라이언트 생성 + 초기화 함수 제공

### 4. 배포: Render Web Service (Docker)
- 기존 Dockerfile 재활용
- `render.yaml`로 서비스 정의
- 환경변수로 `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` 설정

## Risks / Trade-offs

- **[Render cold start]** 무료 서비스는 15분 무활동 시 sleep → 첫 요청 ~30초 지연. → 허용 가능한 수준. 필요시 외부 ping 서비스로 완화 가능
- **[Turso 서비스 의존]** 외부 DB 서비스 장애 시 앱 전체 중단. → Turso는 SQLite 기반이라 안정적이며, 무료 티어도 SLA 제공
- **[TeamSlot 정규화 복잡도]** match_slots 테이블 조인이 필요해 코드가 약간 복잡. → findAll/findById 2개 메서드뿐이라 관리 가능
