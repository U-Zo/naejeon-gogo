## Context

매칭메이킹 페이지(`MatchmakingPage.tsx`)는 두 단계로 구성된다:
1. **SelectPhase**: 10명 참가자 선택
2. **CandidatesPhase**: 알고리즘이 생성한 후보 조합 표시, 선택, 확정

현재 CandidatesPhase에서 후보 카드는 읽기 전용이며, 운영자는 조합을 수정할 수 없다. 각 후보 카드는 팀A(5슬롯) | VS | 팀B(5슬롯) 가로 레이아웃으로 멤버를 표시한다.

기존 프로젝트에 드래그앤드롭 라이브러리는 사용되지 않는다. UI 스타일링은 Vanilla Extract를 사용하며, 상태 관리는 React의 `useState`와 TanStack React Query로 처리된다.

## Goals / Non-Goals

**Goals:**
- 후보 카드 내 멤버 슬롯을 드래그하여 같은 팀 내 포지션 교환 또는 팀 간 멤버 교환 가능
- 드롭 시 MMR 합계 및 차이를 즉시 재계산하여 UI에 반영
- 수정된 후보 카드를 시각적으로 구분 ("수정됨" 배지)
- 수정된 조합을 기존 확정 플로우 그대로 사용 가능
- 터치 디바이스 지원 (모바일 운영 고려)

**Non-Goals:**
- 포지션 유효성 검증 (운영자가 의도적으로 포지션을 변경하는 것을 허용)
- 서버 사이드 MMR 재계산 API 추가
- 후보 카드 간 멤버 이동 (카드 내부에서만 교환)
- 드래그앤드롭 실행취소(Undo) 기능

## Decisions

### 1. 드래그앤드롭 라이브러리: `@dnd-kit/core`

**선택**: `@dnd-kit/core` + `@dnd-kit/sortable`

**대안 검토**:
- `react-beautiful-dnd`: 더 이상 유지보수되지 않음 (archived)
- `react-dnd`: HTML5 backend가 터치를 지원하지 않아 별도 backend 필요
- 네이티브 HTML Drag API: 터치 미지원, 커스텀 드래그 프리뷰 어려움

**선택 이유**:
- React 19 호환, 활발한 유지보수
- 터치 + 마우스 동시 지원 (PointerSensor)
- 접근성(a11y) 내장 (KeyboardSensor)
- 경량 (core ~12KB gzipped)
- Vanilla Extract와 충돌 없음 (인라인 스타일 기반 transform)

### 2. 드래그 단위: 멤버 슬롯 (TeamSlot)

각 멤버 슬롯(`positionTag + memberName`)이 하나의 draggable 아이템이 된다. 드래그 ID는 `${candidateIndex}-${team}-${positionIndex}` 형태로 구성한다.

드롭 시 동작:
- **같은 팀 내 드롭**: 두 슬롯의 멤버와 포지션을 교환 (swap)
- **상대 팀으로 드롭**: 두 슬롯의 멤버만 교환 (각자 기존 포지션 유지)

### 3. 상태 관리: 로컬 React state

`candidates` 배열을 `editedCandidates`로 복사하여 수정본을 관리한다. 원본 `candidates`는 보존하여 "수정됨" 여부를 비교 판단한다. 확정 시 `editedCandidates`의 해당 항목을 서버로 전송한다.

### 4. MMR 재계산: 클라이언트 사이드

멤버별 MMR은 이미 `memberMap`에 존재하므로, 드롭 시 팀 슬롯의 `memberId`로 MMR을 조회하여 합산한다. 서버 API 호출 없이 즉시 계산 가능하다.

### 5. DnD 컨텍스트 범위: 후보 카드 단위

각 후보 카드마다 독립된 `DndContext`를 사용한다. 이렇게 하면 카드 간 멤버 이동이 자연스럽게 방지되고, 이벤트 핸들링이 단순해진다.

## Risks / Trade-offs

- **[드래그앤드롭과 카드 선택 충돌]** → 드래그 시작 시 카드 선택(`onClick`)을 억제. `DndContext`의 `onDragStart`에서 플래그를 설정하고, 카드 클릭 핸들러에서 확인.
- **[모바일에서 스크롤과 드래그 충돌]** → `PointerSensor`에 `activationConstraint: { distance: 8 }` 설정으로 짧은 탭/스크롤과 드래그를 구분.
- **[새 의존성 추가]** → `@dnd-kit`은 널리 사용되는 라이브러리이며 번들 크기 증가가 미미 (~12KB gzipped).
- **[수정된 조합의 밸런스 보장 없음]** → Non-Goal로 명시. 운영자가 의도적으로 밸런스를 조정하는 기능이므로, MMR 차이만 표시하고 경고하지 않는다.
