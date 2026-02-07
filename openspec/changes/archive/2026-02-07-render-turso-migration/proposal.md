## Why

Fly.io 무료 체험이 7일/2시간 제한이라 지속적인 운영이 불가능하다. 현재 데이터를 JSON 파일(`data/matches.json`, `data/members.json`)로 저장하고 있어 persistent volume이 필수인데, 무료 호스팅 중 volume을 제공하는 곳이 없다. DB를 Turso(libSQL)로 전환하면 volume 의존성을 제거하고, Render 무료 웹서비스로 배포할 수 있다.

## What Changes

- **BREAKING**: JSON 파일 기반 Repository 구현체를 Turso DB 기반으로 교체
- `@libsql/client` 의존성 추가
- Turso Repository 구현체 신규 작성 (`match.repository.turso.ts`, `member.repository.turso.ts`)
- DB 초기화(테이블 생성) 로직 추가
- Controller에서 Repository import를 Turso 구현체로 교체
- `fly.toml`, Fly.io 관련 설정 제거
- Render 배포 설정 추가 (`render.yaml`)
- `data/` 디렉토리 및 JSON 파일 저장 로직 제거
- 환경변수에 `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` 추가

## Capabilities

### New Capabilities
- `turso-persistence`: Turso(libSQL) 기반 데이터 영속화 계층. Match/Member Repository의 Turso 구현체 및 DB 스키마 정의
- `render-deployment`: Render 배포 설정. Dockerfile 활용, 환경변수 구성, render.yaml 정의

### Modified Capabilities
<!-- 기존 스펙 없음 -->

## Impact

- **코드**: `src/server/match/`, `src/server/member/` 내 Repository import 변경. JSON Repository 파일은 제거 또는 로컬 개발용으로 유지 가능
- **의존성**: `@libsql/client` 패키지 추가
- **인프라**: Fly.io → Render 전환. Turso 외부 DB 서비스 의존
- **환경변수**: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` 필요
- **데이터**: 기존 JSON 데이터를 Turso DB로 마이그레이션 필요 (수동 또는 스크립트)
- **기존 인터페이스**: `IMatchRepository`, `IMemberRepository`는 변경 없음 - 구현체만 교체
