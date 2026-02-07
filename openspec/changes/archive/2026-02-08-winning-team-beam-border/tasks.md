## 1. 의존성 추가

- [x] 1.1 `motion/react` 패키지를 dependencies에 추가하고 설치

## 2. BorderBeam 컴포넌트 구현

- [x] 2.1 `src/client/components/BorderBeam.css.ts` 생성 — beam 컨테이너의 vanilla-extract 스타일 정의 (absolute, inset 0, pointer-events none, overflow hidden, rounded inherit)
- [x] 2.2 `src/client/components/BorderBeam.tsx` 생성 — Magic UI BorderBeam을 vanilla-extract + motion/react 기반으로 포팅. props: size, duration, delay, colorFrom, colorTo, className

## 3. TeamColumn에 BorderBeam 적용

- [x] 3.1 `HistoryPage.css.ts`에 승리 팀 컬럼용 스타일 추가 — `position: relative`, `overflow: hidden`, `borderRadius` 적용
- [x] 3.2 `HistoryPage.tsx`의 `TeamColumn` 컴포넌트에서 `isWinner`가 true일 때 BorderBeam 렌더링. 팀 A는 블루 계열(`#4a90d9` → `#0ac8b9`), 팀 B는 레드 계열(`#d94a4a` → `#f0b232`) 색상 적용

## 4. 검증

- [x] 4.1 빌드 성공 확인 (`pnpm build`)
- [x] 4.2 타입 체크 통과 확인 (`pnpm typecheck`)
