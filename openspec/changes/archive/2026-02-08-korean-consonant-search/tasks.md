## 1. 검색 유틸리티 함수 생성

- [x] 1.1 `src/client/domains/member/` 경로에 멤버 이름 검색 유틸리티 함수 생성 — `es-hangul`의 `getChoseong`, `canBeChoseong`을 활용하여 검색어가 초성으로만 구성되었는지 판별하고, 초성/substring 매칭을 수행하는 `filterMembersByName(members, search)` 함수 구현

## 2. 페이지 검색 로직 교체

- [x] 2.1 `MembersPage.tsx`의 인라인 필터링 로직을 새 유틸리티 함수 호출로 교체
- [x] 2.2 `MatchmakingPage.tsx`의 인라인 필터링 로직을 새 유틸리티 함수 호출로 교체

## 3. 검증

- [x] 3.1 초성 검색 동작 확인 — 한글 이름 멤버에 대해 초성 입력으로 필터링되는지 수동 검증
- [x] 3.2 기존 substring 검색이 정상 동작하는지 확인
