## Context

현재 HistoryPage에서 "팀 A/B 승리" 버튼과 "취소" 버튼을 누르면 즉시 API가 호출된다. 되돌릴 수 없는 작업(MMR 변동, 매치 삭제)이므로 확인 단계가 필요하다.

기존에 ErrorDialog가 overlay-kit 기반으로 구현되어 있고, common.css.ts에 다이얼로그 관련 스타일(dialogHeader, closeButton, buttonPrimary, buttonSecondary, buttonDanger)이 이미 존재한다.

## Goals / Non-Goals

**Goals:**
- 팀 승리 결정, 매치 취소 시 확인 다이얼로그로 실수 방지
- ErrorDialog와 동일한 overlay-kit 패턴으로 일관성 유지
- 범용 ConfirmDialog로 만들어 다른 곳에서도 재사용 가능

**Non-Goals:**
- 기존 ErrorDialog 리팩토링
- 완료된 매치 결과 되돌리기 기능

## Decisions

### 1. overlay-kit 기반 ConfirmDialog 컴포넌트
- ErrorDialog와 동일한 패턴으로 `openConfirmDialog(message): Promise<boolean>` 함수를 제공
- overlay-kit의 `overlay.openAsync`를 사용하여 Promise 기반으로 확인/취소 결과를 반환
- 스타일은 ErrorDialog.css.ts의 overlay/content 스타일을 재사용하고, 타이틀 색상만 다르게 적용

### 2. HistoryPage 핸들러에서 호출
- handleComplete: `openConfirmDialog` 호출 후 true 반환 시에만 completeMatch 실행
- handleCancel: `openConfirmDialog` 호출 후 true 반환 시에만 cancelMatch 실행

## Risks / Trade-offs

- [UX 마찰 증가] 매번 확인 다이얼로그가 뜨면 번거로울 수 있음 → 되돌릴 수 없는 작업이므로 안전성이 우선
