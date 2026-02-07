## Context

매칭메이킹 페이지에서 @dnd-kit 라이브러리를 사용하여 후보 카드 내 멤버 슬롯 드래그앤드롭 기능을 구현했다. 현재 `PointerSensor`에 `activationConstraint: { distance: 8 }` 설정만 적용되어 있고, 드래그 대상 요소에 CSS `touch-action` 속성이 없다. 이로 인해 모바일에서 드래그 시 브라우저 기본 스크롤이 동시에 발생한다.

관련 파일:
- `src/client/pages/matchmaking/MatchmakingPage.tsx` - DndContext, sensors, DraggableSlot 컴포넌트
- `src/client/pages/matchmaking/MatchmakingPage.css.ts` - `draggableSlot` 스타일

## Goals / Non-Goals

**Goals:**
- 드래그 가능한 슬롯 위에서 터치 시 브라우저 스크롤을 방지한다
- 슬롯 외부 영역에서는 정상 스크롤을 유지한다

**Non-Goals:**
- 드래그앤드롭 로직 자체를 변경하지 않는다
- 데스크톱 동작을 변경하지 않는다

## Decisions

### 1. `touch-action: none`을 `draggableSlot` 스타일에 적용

**선택**: CSS `touch-action: none`을 드래그 가능한 슬롯 스타일에 추가한다.

**근거**: @dnd-kit 공식 문서에서도 드래그 요소에 `touch-action: none`을 권장한다. 이 속성은 해당 요소 위에서만 브라우저 기본 터치 동작(스크롤, 핀치 줌)을 비활성화하므로, 페이지 전체 스크롤에는 영향이 없다.

**대안 검토**:
- `event.preventDefault()` 수동 호출 → @dnd-kit 내부 이벤트 핸들링과 충돌 가능성
- `TouchSensor` 별도 추가 → PointerSensor가 이미 터치를 처리하므로 불필요한 중복

## Risks / Trade-offs

- [드래그 슬롯 영역에서 스크롤 불가] → 슬롯 크기가 작아(멤버 이름 1줄) 스크롤이 필요한 상황이 발생하지 않음
- [구형 브라우저 호환성] → `touch-action`은 모든 주요 모바일 브라우저에서 지원됨 (Can I Use 96%+)
