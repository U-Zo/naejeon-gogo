## Why

멤버 카드에서 연승 중인 멤버를 시각적으로 즉시 구분할 수 있는 방법이 없다. 현재 연승/연패 뱃지 텍스트만 표시되지만, 카드 전체를 한눈에 훑을 때 연승 멤버가 눈에 띄지 않는다. 연승 단계에 따라 카드 테두리에 BorderBeam 효과를 단계적으로 적용하여, 뜨거운 연승 멤버를 직관적으로 인지할 수 있도록 한다.

## What Changes

- 멤버 카드(`MemberCard`) 및 매칭 페이지 멤버 행(`memberRow`)에 연승(`streak.type === 'win'` && `streak.count >= 2`) 상태일 때만 `BorderBeam` 효과를 조건부 렌더링
- Magic UI의 BorderBeam을 vanilla-extract + motion/react 기반으로 포팅하여 새 컴포넌트 생성
- 2~5+ 연승 단계별로 빔 개수, 속도, 크기, 색상이 점진적으로 증가 (borderWidth는 항상 1px 고정):
  - **2연승**: 빔 1개, 붉은 gold 단색
  - **3연승**: 빔 2개, 붉은 계열 그라데이션
  - **4연승**: 빔 2개, 오렌지-레드 그라데이션
  - **5연승 이상**: 빔 3개, 무지개 다색 그라데이션 (red/magenta, cyan/green, gold/orange)
- 같은 단계의 빔들은 동일한 속도로 이동하며 균등한 간격 유지
- 멤버 페이지와 매칭 페이지는 카드 크기가 다르므로 각각 독립적인 빔 설정 사용

## Capabilities

### New Capabilities

- `win-streak-beam`: 멤버 카드/행에 연승 단계별 BorderBeam 효과를 적용하는 기능. BorderBeam 컴포넌트 포팅, 페이지별 `getStreakBeams()` 헬퍼 함수, 연승 count에 따른 다중 빔 매핑 로직을 포함한다.

### Modified Capabilities

_(없음)_

## Impact

- **신규 컴포넌트**: `src/client/components/BorderBeam.tsx`, `BorderBeam.css.ts` — Magic UI BorderBeam 포팅
- **멤버 페이지**: `MembersPage.tsx` — `MemberCard`에 BorderBeam 조건부 렌더링, `MembersPage.css.ts` — `memberCard` 스타일에 position/overflow 추가
- **매칭 페이지**: `MatchmakingPage.tsx` — `memberRow`에 BorderBeam 조건부 렌더링, `MatchmakingPage.css.ts` — `memberRow` 스타일에 position/overflow 추가
- **의존성**: `motion` (motion/react) 패키지 신규 추가
- **API/데이터**: 변경 없음 — `Member.streak` 데이터는 이미 존재
