## Why

로컬 개발 시 Turso DB 연결이 필요하여 오프라인이나 환경 설정 없이는 개발이 불가능하다. 로컬에서는 JSON 파일 기반 저장소를 사용하여 DB 없이도 개발할 수 있어야 한다.

## What Changes

- JSON 파일 기반 IMatchRepository, IMemberRepository 구현체 추가
- 환경 변수(TURSO_DATABASE_URL) 유무에 따라 Turso/JSON repository를 자동 선택하는 팩토리 함수 도입
- controller에서 Turso repository 직접 생성 대신 팩토리 함수 사용

## Capabilities

### New Capabilities

(없음 — 요구사항 변경 없이 내부 구현체 추가)

### Modified Capabilities

(없음 — 외부 동작 변경 없음)

## Impact

- **서버**: JSON repository 구현체 2개 추가, repository 팩토리 함수 추가
- **controller**: Turso 직접 import → 팩토리 함수 호출로 변경
- **파일시스템**: 로컬 실행 시 `data/` 디렉토리에 JSON 파일 생성
