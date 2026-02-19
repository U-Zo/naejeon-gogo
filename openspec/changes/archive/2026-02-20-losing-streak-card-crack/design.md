## Context

현재 연승 시에는 `ShineBorder` 컴포넌트(CSS animation 기반 빛남 오버레이)가 카드에 적용되고, 단계별로 빛의 수·속도·색상이 달라진다. 연패 시에는 텍스트 배지(`streakBadgeLose`)만 표시되어 시각적 비대칭이 존재한다.

카드는 두 곳에서 렌더링된다:
- `MemberCard` (members-page.tsx) — 멤버 목록 페이지
- `SelectPhase` (select-phase.tsx) — 매치메이킹 선택 화면

스타일링은 vanilla-extract(CSS-in-TS)를 사용하며, 테마 변수는 `src/client/styles/theme.css.ts`에 정의되어 있다.

## Goals / Non-Goals

**Goals:**
- 연패 2회 이상 시 카드에 금 간 효과를 3단계(2연패, 3연패, 4연패+)로 적용
- 360도 테두리에서 가운데를 향해 뻗어나가는 번개 모양 금 표현
- 단계가 올라갈수록 금 개수·굵기·길이·불투명도 증가
- MemberCard와 SelectPhase 양쪽에 일관되게 적용

**Non-Goals:**
- 테두리 색상 변경 — 기본 테두리 유지
- 연패 시 애니메이션(움직이는 금) — 정적 오버레이로 충분
- 연승 효과 변경 — 기존 ShineBorder 로직은 그대로 유지
- 서버 사이드 데이터 모델 변경 — 기존 `Streak` 타입 그대로 활용

## Decisions

### 1. SVG 인라인 오버레이 React 컴포넌트 (`CrackOverlay`)

- SVG `<path>`를 사용하면 번개 모양 금의 갈래·분기·굵기를 정밀하게 제어 가능
- `ShineBorder`와 동일하게 `position: absolute; inset: 0; pointer-events: none` 패턴으로 카드 위에 오버레이

### 2. 시드 기반 절차적 생성 (mulberry32 PRNG)

- 사전 정의 path는 자연스럽지 않고, `Math.random()`은 리렌더마다 변경됨
- 시드 기반 PRNG(mulberry32)로 레벨별 고정 시드를 사용하여 **항상 동일한 패턴**을 절차적으로 생성
- 모듈 레벨에서 한 번 생성하고 캐싱하여 성능 최적화

### 3. 번개 모양 금 생성 알고리즘

- 360도 균등 분배된 각도에서 카드 테두리 위 시작점을 계산 (`getEdgePoint`)
- 시작점에서 가운데(50,50)를 향해 직선 세그먼트(`L` 커맨드)로 지그재그 진행
- 각 세그먼트의 길이와 좌우 편향(jitter)이 불규칙하여 자연스러운 번개 형태
- 메인 금에서 확률적으로 가지(branch)가 분기

### 4. 3단계 효과 설계

| 단계 | streak count | 메인 금 수 | 선 굵기 | 길이 (가운데 대비) | 불투명도 | 가지 확률 |
|------|-------------|-----------|---------|-------------------|---------|----------|
| 1 | 2 | 5개 | 0.6~1.0 | 15~30% | 15~30% | 10% |
| 2 | 3 | 8개 | 0.9~1.6 | 30~55% | 22~42% | 20% |
| 3 | 4+ | 11개 | 1.2~2.4 | 70~100% | 32~55% | 35% |

금 색상: `rgba(0,0,0,opacity)` — 검은색 계열

### 5. 컴포넌트 구조

```
src/client/components/
  crack-overlay.tsx        — CrackOverlay 컴포넌트 + 생성 알고리즘 + 공개 유틸리티
  crack-overlay.css.ts     — vanilla-extract 스타일 (absolute 오버레이)
```

- `CrackOverlay` props: `{ level: 1 | 2 | 3 }`
- `getLoseStreakLevel(count)`: streak count → level 변환 (2→1, 3→2, 4+→3)
- `getCrackBorderColor(level)`: 현재 모든 레벨 undefined (테두리 변경 없음)

## Risks / Trade-offs

- **카드 크기 차이** → SVG viewBox를 `0 0 100 100`(비율 기반)으로 설정하고 `preserveAspectRatio="none"`으로 대응
- **성능** → SVG 오버레이는 가볍지만, 멤버 리스트가 많을 경우 다수의 SVG DOM 노드가 생성됨. 모듈 레벨 캐싱으로 path 재생성 방지. 실질적으로 문제 없는 수준 (수십 명 규모)
