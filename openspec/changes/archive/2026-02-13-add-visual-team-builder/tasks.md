## 1. 프로젝트 셋업

- [x] 1.1 Matter.js 및 @types/matter-js 의존성 설치
- [x] 1.2 `/race` 라우트 파일 생성 (`src/routes/race.tsx`)
- [x] 1.3 Layout 컴포넌트 tabs 배열에 경주 탭 추가 (아이콘 + "경주" 라벨)

## 2. 레이스 페이지 구조

- [x] 2.1 `src/client/pages/race/` 디렉터리 및 `race-page.tsx` 생성 (Phase 상태 관리: select → race → result)
- [x] 2.2 `race-page.css.ts` 스타일 파일 생성

## 3. 멤버 선택 Phase

- [x] 3.1 `race-select-phase.tsx` 컴포넌트 구현 (기존 SelectPhase 패턴 재활용, 10명 선택 + "경주 시작" 버튼)

## 4. 물리 엔진 코어

- [x] 4.1 `engine/types.ts` 생성 — Racer, RaceConfig, RaceState 타입 정의
- [x] 4.2 `engine/race-simulation.ts` 구현 — Matter.js 월드 생성, 트랙(상하 벽 + 결승선), 레이서 바디 10개 배치
- [x] 4.3 레이서 랜덤 힘 적용 로직 구현 (주기적 forceInterval마다 랜덤 수평 force)
- [x] 4.4 공기저항(frictionAir) 및 레이서 간 충돌 설정
- [x] 4.5 골인 감지 로직 구현 (레이서가 결승선 x좌표를 넘으면 순위 기록)
- [x] 4.6 경주 시간 제어 구현 (1분 최소 보장, 2분 초과 시 부스트 강제 종료)

## 5. 카메라 시스템

- [x] 5.1 `engine/camera.ts` 구현 — Camera 클래스 (x, y, zoom, update 메서드)
- [x] 5.2 초기 전체 조감 뷰 구현 (모든 레이서 + 결승선 포함)
- [x] 5.3 골인 시 남은 레이서 추적 + 줌인 로직 구현
- [x] 5.4 lerp 기반 부드러운 카메라 전환 구현

## 6. Canvas 렌더링

- [x] 6.1 `engine/renderer.ts` 구현 — Canvas 2D 렌더러 (카메라 변환 적용)
- [x] 6.2 트랙 렌더링 (출발선, 결승선, 상하 경계)
- [x] 6.3 레이서 렌더링 (구분 가능한 시각 요소 + 멤버 이름 라벨)
- [x] 6.4 골인 순위 오버레이 표시

## 7. 레이스 Canvas 컴포넌트

- [x] 7.1 `race-canvas.tsx` 구현 — Canvas ref, requestAnimationFrame 루프, 시뮬레이션·카메라·렌더러 통합
- [x] 7.2 경주 완료 시 result phase 전환 콜백

## 8. 결과 Phase

- [x] 8.1 `race-result-phase.tsx` 구현 — 순위 리스트 + 팀A(1~5위)/팀B(6~10위) 표시
- [x] 8.2 "매치 확정" 버튼 — 기존 createMatch API 호출 후 히스토리 페이지로 이동
- [x] 8.3 "다시 경주" 버튼 — 같은 멤버로 새 시뮬레이션 시작
- [x] 8.4 "돌아가기" 버튼 — 멤버 선택 phase로 복귀

## 9. 파라미터 튜닝 및 마무리

- [x] 9.1 트랙 길이, forceRange, frictionAir, forceInterval 파라미터 조정하여 1~2분 경주 시간 확보
- [x] 9.2 모바일 환경에서 Canvas 사이즈 반응형 처리
- [x] 9.3 race 페이지 code-splitting 확인 (Matter.js 번들 분리)
