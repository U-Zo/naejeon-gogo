## Why

진행 중 매치에서 "팀 승리" 또는 "취소" 버튼을 누르면 즉시 실행되어, 실수로 잘못된 팀을 승리로 선택하거나 매치를 취소할 위험이 있다. 되돌릴 수 없는 작업이므로 확인 다이얼로그로 더블체크가 필요하다.

## What Changes

- 팀 승리 버튼 클릭 시 "팀 X 승리로 기록하시겠습니까?" 확인 다이얼로그를 표시한다
- 매치 취소 버튼 클릭 시 "매치를 취소하시겠습니까?" 확인 다이얼로그를 표시한다
- 확인 다이얼로그는 기존 ErrorDialog와 동일한 overlay-kit 패턴으로 구현한다
- 사용자가 "확인"을 누른 경우에만 실제 API를 호출한다

## Capabilities

### New Capabilities

- `confirm-dialog`: 확인/취소 선택이 가능한 범용 확인 다이얼로그 컴포넌트

### Modified Capabilities

- `match-history`: 승리 결정 및 매치 취소 시 확인 다이얼로그를 거치도록 요구사항 변경

## Impact

- `src/client/components/`: 새 ConfirmDialog 컴포넌트 추가
- `src/client/pages/history/HistoryPage.tsx`: handleComplete, handleCancel에 확인 다이얼로그 호출 추가
