## Context

전적 페이지(`HistoryPage.tsx`)의 완료된 매치에서 승리 팀은 텍스트 배지와 이모지로만 구분된다. 프로젝트는 vanilla-extract + React 19 기반이며, 진행 중 매치(`inProgressCard`)에서 이미 `keyframes` 기반 borderGlow 애니메이션을 사용하고 있다. Magic UI의 BorderBeam 컴포넌트는 Tailwind CSS + `motion/react` 기반이므로, 프로젝트 스타일에 맞게 포팅이 필요하다.

## Goals / Non-Goals

**Goals:**
- 승리 팀 컬럼에 빛이 테두리를 따라 순환하는 BorderBeam 애니메이션을 적용
- 팀 색상(A=블루, B=레드)에 맞는 beam 색상으로 기존 디자인 체계와 통일
- 재사용 가능한 BorderBeam 컴포넌트로 구현

**Non-Goals:**
- 패배 팀에 대한 시각적 변경
- inProgressCard의 기존 borderGlow 애니메이션 수정
- 전체 matchCard에 대한 효과 (승리 팀 컬럼만 대상)

## Decisions

### 1. BorderBeam 포팅 방식: vanilla-extract + inline style

Magic UI의 BorderBeam은 Tailwind CSS 유틸리티 클래스를 사용하지만, 이 프로젝트는 vanilla-extract를 사용한다. BorderBeam의 핵심 애니메이션은 CSS `offset-path`와 `motion/react`의 `motion.div`로 구현되므로, 레이아웃 스타일은 vanilla-extract로, 동적 애니메이션 속성은 inline style + motion props로 처리한다.

**대안 검토:**
- 순수 CSS keyframes로 구현 → offset-path 기반 빔 순환 효과를 keyframes만으로 구현하기 어려움
- Tailwind 도입 → 프로젝트 스타일 체계와 충돌

### 2. 컴포넌트 위치: `src/client/components/BorderBeam.tsx`

공통 컴포넌트 디렉토리에 배치하여 다른 페이지에서도 재사용 가능하게 한다. CSS는 `BorderBeam.css.ts`로 분리.

### 3. 적용 대상: TeamColumn의 wrapper div

`TeamColumn` 컴포넌트에 `isWinner` prop이 이미 존재하므로, 승리 팀일 때만 BorderBeam을 렌더링한다. `teamColumn` div에 `position: relative`와 `overflow: hidden`을 추가하여 beam이 테두리를 따라 순환하도록 한다.

### 4. Beam 색상 매핑

- 팀 A 승리: `colorFrom=#4a90d9` → `colorTo=#0ac8b9` (블루 계열 그라데이션)
- 팀 B 승리: `colorFrom=#d94a4a` → `colorTo=#f0b232` (레드-골드 계열 그라데이션)

기존 테마 변수(`vars.color.teamA`, `vars.color.teamB`)를 활용하되, beam의 to 색상은 시각적 다이내미즘을 위해 보조 색상을 사용한다.

### 5. 의존성: motion/react

`motion/react`(framer-motion v11+)를 신규 의존성으로 추가한다. Magic UI의 BorderBeam이 `motion.div`의 `animate` + `transition` props를 핵심적으로 사용하므로 필수적이다.

## Risks / Trade-offs

- **[성능] 다수 매치 동시 렌더링** → 완료된 매치가 많을 때 다수의 motion.div 애니메이션이 동시 실행될 수 있음. `will-change: transform` 사용 및 CSS `offset-path` 기반이므로 GPU 가속됨. 뷰포트 밖 요소는 브라우저가 자동 최적화.
- **[호환성] CSS offset-path 지원** → 모던 브라우저(Chrome 46+, Firefox 72+, Safari 16+)에서 지원. 미지원 시 beam이 표시되지 않을 뿐 기능에 영향 없음(graceful degradation).
- **[번들 크기] motion/react 추가** → tree-shaking 지원으로 실제 사용하는 motion.div만 번들에 포함. 약 15-20KB gzip 증가 예상.
