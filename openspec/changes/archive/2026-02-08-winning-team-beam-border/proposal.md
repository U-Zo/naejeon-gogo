## Why

전적 페이지에서 완료된 매치의 승리 팀과 패배 팀의 시각적 구분이 텍스트 배지(`팀 A 승`)와 이모지(🏆)에만 의존하고 있어, 한눈에 승리 팀을 파악하기 어렵다. Magic UI의 BorderBeam 이펙트를 승리 팀 컬럼에 적용하여 빛이 테두리를 따라 흐르는 애니메이션으로 가시성을 높인다.

## What Changes

- 승리 팀의 `teamColumn` 영역에 BorderBeam 애니메이션 효과를 적용하여 빛이 테두리를 따라 순환하는 이펙트 추가
- Magic UI의 BorderBeam 컴포넌트를 프로젝트 스타일(vanilla-extract + motion/react)에 맞게 포팅하여 도입
- 팀 A 승리 시 블루(#4a90d9) 계열, 팀 B 승리 시 레드(#d94a4a) 계열의 beam 색상을 적용하여 기존 디자인 체계와 통일
- `motion/react` 패키지 신규 의존성 추가

## Capabilities

### New Capabilities
- `border-beam-effect`: Magic UI의 BorderBeam 컴포넌트를 vanilla-extract 프로젝트에 맞게 포팅한 재사용 가능한 이펙트 컴포넌트

### Modified Capabilities
- `match-history`: 완료된 매치의 승리 팀 컬럼에 BorderBeam 이펙트를 적용하여 시각적 강조 추가

## Impact

- **코드**: `HistoryPage.tsx`의 `MatchCard`/`TeamColumn` 컴포넌트 수정, 새 BorderBeam 컴포넌트 파일 추가
- **의존성**: `motion/react` (framer-motion) 패키지 추가 필요
- **성능**: CSS 애니메이션 기반이므로 렌더링 성능에 미치는 영향 미미. 다수의 매치 카드가 동시에 보일 때의 애니메이션 부하 고려 필요
