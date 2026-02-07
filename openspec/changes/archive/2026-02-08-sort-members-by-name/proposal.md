## Why

멤버 목록 API가 현재 정렬 없이 데이터를 반환하고 있어, 멤버를 찾기 어렵다. 멤버 이름 기준 가나다순(한글 정렬)으로 정렬하여 일관된 순서로 표시되도록 개선한다.

## What Changes

- 멤버 목록 API(`getMembers`)가 멤버 이름 기준 가나다순으로 정렬된 결과를 반환하도록 변경
- Repository 레이어(Turso, JSON)에서 정렬 로직 적용

## Capabilities

### New Capabilities

(없음)

### Modified Capabilities

- `member-management`: 멤버 목록 조회 시 이름 기준 가나다순 정렬 요구사항 추가

## Impact

- `src/server/member/member.repository.turso.ts`: `findAll()` 쿼리에 `ORDER BY name` 추가
- `src/server/member/member.repository.json.ts`: `readData()` 또는 `findAll()`에서 이름순 정렬 추가
- 클라이언트 사이드 변경 없음 (API 응답이 이미 정렬되어 내려옴)
