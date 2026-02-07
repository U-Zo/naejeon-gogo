## 1. 의존성 설치

- [x] 1.1 `@dnd-kit/core`와 `@dnd-kit/sortable`, `@dnd-kit/utilities` 패키지 설치

## 2. 상태 관리 로직

- [x] 2.1 `CandidatesPhase`에 `editedCandidates` 상태 추가 (원본 `candidates`를 복사하여 초기화)
- [x] 2.2 슬롯 교환 핸들러 구현: 같은 팀 내 swap (멤버+포지션 교환), 팀 간 swap (멤버만 교환)
- [x] 2.3 MMR 재계산 유틸리티 구현: `memberMap`에서 MMR 조회하여 팀별 합계 및 차이 계산
- [x] 2.4 수정 여부 판별 로직 구현: 원본 `candidates`와 `editedCandidates` 비교
- [x] 2.5 리롤 시 `editedCandidates`를 새 결과로 초기화, 확정 시 `editedCandidates` 데이터 전송

## 3. 드래그앤드롭 UI 구현

- [x] 3.1 각 후보 카드에 독립 `DndContext` 래핑 및 `PointerSensor` (distance: 8) + `KeyboardSensor` 설정
- [x] 3.2 각 멤버 슬롯을 `useDraggable`/`useDroppable` 훅으로 드래그/드롭 가능하게 변환
- [x] 3.3 `DragOverlay`로 드래그 중 슬롯의 시각적 프리뷰 표시
- [x] 3.4 `onDragEnd` 핸들러에서 드래그 ID 파싱 후 슬롯 교환 로직 호출

## 4. 스타일링

- [x] 4.1 드래그 중 원본 슬롯 스타일 (반투명/점선 테두리)
- [x] 4.2 유효 드롭 대상 슬롯 강조 스타일 (테두리 하이라이트)
- [x] 4.3 "수정됨" 배지 스타일 추가 (후보 카드 헤더 옆)
- [x] 4.4 드래그 시 카드 선택 클릭 억제 (onDragStart 플래그 + onClick 가드)

## 5. 통합 및 검증

- [x] 5.1 카드 선택/확정/리롤 기존 플로우가 드래그앤드롭 추가 후에도 정상 동작하는지 확인
- [x] 5.2 모바일 터치 환경에서 드래그와 스크롤이 충돌하지 않는지 확인
