## Context

현재 member와 match 모듈 모두 repository 인터페이스(`IMatchRepository`, `IMemberRepository`)를 정의하고 Turso 구현체만 존재한다. controller에서 Turso 구현체를 직접 import하여 사용 중이다.

Repository 인터페이스:
- `IMatchRepository`: findAll, findById, save, delete
- `IMemberRepository`: findAll, findById, save, saveAll, delete

## Goals / Non-Goals

**Goals:**
- TURSO_DATABASE_URL이 없으면 JSON 파일 저장소 자동 사용
- 기존 Turso 사용 코드(배포 환경)에 영향 없음
- 별도 의존성 추가 없이 Node.js fs 모듈만 사용

**Non-Goals:**
- JSON 저장소의 동시성 제어 (로컬 단일 사용자 전제)
- 마이그레이션 도구 (JSON ↔ Turso 데이터 동기화)

## Decisions

### 1. Repository 팩토리 함수

`src/server/repository.ts`에 팩토리 함수를 두고 환경 변수로 분기:

```
TURSO_DATABASE_URL 있음 → TursoXxxRepository
TURSO_DATABASE_URL 없음 → JsonXxxRepository
```

controller에서는 팩토리 함수만 호출하여 구현체를 모른 채 사용.

**대안: DI 컨테이너** — 현재 코드베이스 규모에서 과도. 단순 팩토리가 적절.

### 2. JSON 파일 저장 경로

프로젝트 루트의 `data/` 디렉토리. `members.json`, `matches.json` 두 파일로 관리.
`.gitignore`에 `data/` 추가.

### 3. JSON repository 구현 방식

각 메서드 호출 시 파일을 읽고, 수정 후 전체를 다시 쓰는 단순한 방식. 로컬 개발용이므로 성능 무관.

## Risks / Trade-offs

**[Risk] JSON 파일 손상** → 로컬 개발 전용이므로 수동 복구 가능. 치명적이지 않음.

**[Risk] Turso 구현체와 동작 차이** → 같은 인터페이스를 구현하므로 논리적 동작은 동일. DB 트랜잭션 보장은 없으나 로컬 단일 사용자라 문제없음.
