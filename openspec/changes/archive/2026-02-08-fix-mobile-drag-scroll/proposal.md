## Why

모바일 환경에서 매칭메이킹 후보 카드의 드래그앤드롭 시 브라우저 기본 스크롤이 동시에 발생하여 정상적인 드래그 조작이 불가능하다. 드래그앤드롭 기능이 최근 추가되었으나 모바일 터치 이벤트에 대한 스크롤 방지 처리가 누락되었다.

## What Changes

- 드래그 가능한 슬롯 요소에 `touch-action: none` CSS 속성을 추가하여 브라우저 기본 터치 동작(스크롤, 줌)을 비활성화
- 드래그 활성화 임계값(activation distance)을 모바일 환경에 맞게 조정하여 탭/스크롤과 드래그를 더 정확하게 구분

## Capabilities

### New Capabilities

(없음)

### Modified Capabilities

- `drag-drop-team-edit`: 모바일 터치 환경에서 드래그 시 스크롤이 방지되어야 한다는 요구사항 추가

## Impact

- `src/client/pages/matchmaking/MatchmakingPage.css.ts` - `draggableSlot` 스타일에 `touch-action` 속성 추가
- `src/client/pages/matchmaking/MatchmakingPage.tsx` - PointerSensor 활성화 임계값 조정 가능
