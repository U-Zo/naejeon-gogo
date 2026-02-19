## 1. CrackOverlay 컴포넌트 생성

- [x] 1.1 `src/client/components/crack-overlay.css.ts` 생성 — absolute 오버레이 스타일 (ShineBorder 패턴 참고, `position: absolute; inset: 0; pointer-events: none`)
- [x] 1.2 `src/client/components/crack-overlay.tsx` 생성 — level(1~4)을 props로 받아 단계별 SVG crack path를 렌더링하는 컴포넌트
- [x] 1.3 단계별 SVG path 데이터 정의 — `getCrackPaths(level)` 유틸리티로 각 단계의 금 갈래 path 배열 반환 (viewBox 비율 기반)

## 2. streak → crack level 변환 유틸리티

- [x] 2.1 `getLoseStreakLevel(count: number): number | null` 유틸리티 함수 작성 — count 2→level 1, 3→level 2, 4→level 3, 5+→level 4, 그 외 null

## 3. MemberCard에 CrackOverlay 적용

- [x] 3.1 `members-page.tsx`의 `MemberCard`에서 lose streak 2회 이상일 때 `CrackOverlay` 렌더링 추가
- [x] 3.2 level 3(4연패) 이상일 때 카드 `borderColor`를 어둡게 변경하는 로직 추가

## 4. SelectPhase에 CrackOverlay 적용

- [x] 4.1 `select-phase.tsx`의 멤버 카드 영역에서 lose streak 2회 이상일 때 `CrackOverlay` 렌더링 추가
- [x] 4.2 level 3(4연패) 이상일 때 카드 `borderColor`를 어둡게 변경하는 로직 추가

## 5. 시각 검증

- [x] 5.1 각 단계(2~5+연패)별 금 효과가 의도대로 표시되는지 브라우저에서 확인
- [x] 5.2 기존 연승 ShineBorder 효과가 영향받지 않는지 확인
- [x] 5.3 카드 클릭/호버 등 기존 인터랙션이 정상 작동하는지 확인
