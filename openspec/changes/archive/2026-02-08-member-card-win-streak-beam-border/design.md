## Context

멤버 관리 페이지(`MembersPage.tsx`)의 `MemberCard`와 매칭 페이지(`MatchmakingPage.tsx`)의 `memberRow`는 멤버 정보를 표시하는 카드/행 UI이다. 연승 데이터(`Member.streak`)는 이미 서버에서 계산되어 제공되며, `streak.type === 'win' && streak.count >= 2`일 때 텍스트 뱃지가 표시된다.

프로젝트에 이미 존재하는 `ShineBorder` 컴포넌트(`src/client/components/ShineBorder.tsx`)는 CSS keyframes 기반의 radial-gradient 애니메이션으로 테두리에 빛나는 효과를 제공한다. 외부 의존성 없이 vanilla-extract만으로 동작한다.

## Goals / Non-Goals

**Goals:**
- 연승(2+) 멤버에 단계별 ShineBorder 효과를 적용하여 시각적 구분을 제공한다
- 연승 단계가 높을수록 샤인 개수, 속도, 색상 다양성이 증가한다
- 동일 단계의 샤인들은 같은 속도로 애니메이션되며 균등한 간격을 유지한다

**Non-Goals:**
- 연패에 대한 효과는 적용하지 않는다

## Decisions

### 1. 컴포넌트 선택 — ShineBorder (기존 컴포넌트 활용)

프로젝트에 이미 존재하는 `ShineBorder` 컴포넌트를 활용한다. CSS keyframes 기반이므로 `motion/react` 등 추가 의존성이 불필요하다. `delay` prop을 추가하여 다중 샤인의 등간격을 지원한다.

props: duration, shineColor, borderWidth, delay (신규).

### 2. ShineBorder에 delay prop 추가

다중 샤인의 등간격 배치를 위해 `delay` prop을 추가한다. CSS `animationDelay`를 통해 구현하며, 기본값은 0이다.

### 3. 다중 샤인 — 단계별 샤인 개수 증가

연승 단계별로 여러 개의 ShineBorder를 렌더링한다. 같은 단계의 샤인들은 동일한 duration을 사용하고 delay를 `duration / 샤인개수 * index`로 균등 배분하여 등간격을 유지한다.

### 4. 색상 — 붉은 gold에서 무지개로 점진적 변화

- 2연승: 어두운 골드 단색 ['#6a5018', '#5a4828']
- 3연승: 밝은 브라운 ['#b07850', '#a06858']
- 4연승: 오렌지-레드 2색 ['#d84a10', '#b83838'] / ['#c88030', '#d84a10']
- 5연승+: 무지개 3색 ['#d84a10', '#cc30a0'] / ['#10a8c8', '#30b818'] / ['#c8a010', '#d84a10']

### 5. 페이지별 독립 설정 — 공통 유틸 사용하지 않음

멤버 페이지와 매칭 페이지는 각 페이지에 `getStreakShines()` 함수를 독립적으로 정의한다.

**두 페이지 공통 설정:**

| 연승 | 샤인 개수 | duration |
|------|----------|----------|
| 2 | 1 | 12s |
| 3 | 1 | 10s |
| 4 | 2 | 8s |
| 5+ | 3 | 7s |

### 6. 스타일 변경 — 두 페이지 모두 position/overflow 유지

ShineBorder는 absolute positioning을 사용하므로 `memberCard`와 `memberRow` 스타일의 `position: 'relative'`과 `overflow: 'hidden'`을 유지한다.

### 7. BorderBeam 컴포넌트 제거

ShineBorder로 전환하므로 `BorderBeam.tsx`, `BorderBeam.css.ts`를 삭제하고, `motion` 패키지 의존성도 제거한다.

## Risks / Trade-offs

- **[시각적 차이]** ShineBorder는 radial-gradient 스윕 방식으로, BorderBeam의 빛 점 이동 방식과 시각적으로 다르다. 단계별 색상/속도/개수 차이로 연승 구분 효과는 유지된다.
- **[의존성 감소]** `motion/react` 의존성을 제거하여 번들 크기가 줄어든다.
