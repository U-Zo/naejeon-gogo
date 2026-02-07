## ADDED Requirements

### Requirement: 로컬 환경 자동 감지
시스템은 TURSO_DATABASE_URL 환경 변수의 유무에 따라 저장소 구현체를 자동으로 선택해야 한다.

#### Scenario: Turso DB 환경
- **WHEN** TURSO_DATABASE_URL 환경 변수가 설정되어 있다
- **THEN** 시스템은 Turso DB 기반 저장소를 사용한다

#### Scenario: 로컬 환경
- **WHEN** TURSO_DATABASE_URL 환경 변수가 설정되어 있지 않다
- **THEN** 시스템은 JSON 파일 기반 저장소를 사용한다
