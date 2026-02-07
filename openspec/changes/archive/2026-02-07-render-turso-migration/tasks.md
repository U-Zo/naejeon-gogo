## 1. 의존성 및 DB 기반 설정

- [x] 1.1 `@libsql/client` 패키지 설치
- [x] 1.2 `src/server/db.ts` 생성: Turso 클라이언트 생성 + 환경변수 검증 + `initDb()` 테이블 초기화 함수

## 2. Turso Repository 구현

- [x] 2.1 `src/server/member/member.repository.turso.ts` 생성: `TursoMemberRepository` 구현 (findAll, findById, save, saveAll, delete)
- [x] 2.2 `src/server/match/match.repository.turso.ts` 생성: `TursoMatchRepository` 구현 (findAll, findById, save) — match_slots 조인 포함

## 3. Repository 교체 및 초기화 연결

- [x] 3.1 Controller에서 JsonMatchRepository → TursoMatchRepository import 교체
- [x] 3.2 Controller에서 JsonMemberRepository → TursoMemberRepository import 교체
- [x] 3.3 앱 시작 시 `initDb()` 호출 연결

## 4. 배포 설정 전환

- [x] 4.1 `render.yaml` 생성: Docker 웹서비스 정의, 환경변수 선언
- [x] 4.2 `fly.toml` 삭제
- [x] 4.3 JSON Repository 파일 제거 (`match.repository.json.ts`, `member.repository.json.ts`)
- [x] 4.4 `data/` 디렉토리 및 JSON 데이터 파일 제거, `.gitignore`에서 관련 항목 정리
