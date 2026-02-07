## Context

현재 멤버 목록 API(`getMembers`)는 Repository의 `findAll()`을 통해 데이터를 반환하며, 정렬 로직이 없다.
- Turso DB: `SELECT * FROM members` (ORDER BY 없음)
- JSON 파일: `members.json`을 그대로 파싱하여 반환

클라이언트에서는 API 응답을 그대로 렌더링하므로, 서버에서 정렬하면 모든 페이지에 일관되게 반영된다.

## Goals / Non-Goals

**Goals:**
- 멤버 목록 API 응답을 이름 기준 가나다순(오름차순)으로 정렬

**Non-Goals:**
- 클라이언트 사이드 정렬 로직 추가
- 정렬 기준 파라미터화 (향후 필요 시 별도 변경)
- 임시 멤버와 고정 멤버 간 정렬 우선순위 구분

## Decisions

### Repository 레이어에서 정렬 적용

**선택**: 각 Repository 구현체(`findAll`)에서 정렬 처리

**이유**: Service 레이어에서 정렬하면 한 곳에서 관리할 수 있지만, Turso DB의 경우 SQL `ORDER BY`를 활용하는 것이 성능상 유리하다. JSON Repository는 메모리에서 `localeCompare('ko')`로 정렬한다. 두 구현체 모두 `findAll()`에서 정렬하여 일관성을 유지한다.

**대안**: Service 레이어에서 공통 정렬 → DB 최적화를 포기하게 됨

### 한글 정렬에 `COLLATE` 대신 기본 정렬 사용

**선택**: Turso(SQLite)에서 `ORDER BY name ASC` 사용

**이유**: SQLite의 기본 바이너리 정렬은 UTF-8 인코딩 기준이며, 한글 가나다순과 일치한다 (가=0xEA, 나=0xEB, ... 순서). 별도 collation 설정 불필요.

## Risks / Trade-offs

- **[한글 외 문자 혼재 시 정렬 순서]** → 영문/숫자가 한글보다 앞에 오는 UTF-8 기본 동작. 현재 멤버 이름이 한글 위주이므로 문제없음.
