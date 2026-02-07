## Why

멤버 검색 시 현재는 단순 문자열 포함(substring) 매칭만 지원하여, 한글 이름을 검색할 때 초성(자음)만으로 검색할 수 없다. 예를 들어 "김철수"를 찾으려면 "김" 또는 "철수"를 입력해야 하며, "ㄱㅊㅅ"로는 검색되지 않는다. 한글 초성 검색은 한국 사용자에게 매우 자연스러운 검색 방식이므로 이를 지원한다.

## What Changes

- 멤버 이름 검색 시 한글 초성(자음) 입력으로도 매칭되도록 검색 로직 확장
- 기존 substring 매칭은 그대로 유지하면서, 초성 매칭을 추가로 지원
- 멤버 목록 페이지(`MembersPage`)와 매치메이킹 페이지(`MatchmakingPage`) 모두에 적용
- 이미 설치된 `es-hangul` 라이브러리의 `getChoseong` 함수 활용

## Capabilities

### New Capabilities

- `korean-consonant-search`: 한글 초성(자음)으로 멤버 이름을 검색할 수 있는 기능. 기존 substring 검색과 함께 동작하여, 입력값이 초성으로만 이루어진 경우 이름의 초성과 매칭한다.

### Modified Capabilities

- `member-management`: 멤버 검색 동작에 초성 매칭 요구사항 추가

## Impact

- `src/client/pages/members/MembersPage.tsx` — 멤버 목록 필터링 로직 변경
- `src/client/pages/matchmaking/MatchmakingPage.tsx` — 매치메이킹 후보 필터링 로직 변경
- `es-hangul` 라이브러리 의존성 (이미 설치됨, `getChoseong` 함수 추가 사용)
- 서버 측 변경 없음 (클라이언트 사이드 필터링)
