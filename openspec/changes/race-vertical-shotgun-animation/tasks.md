## 1. 타입 및 설정 변경

- [x] 1.1 `types.ts`에 `Decoration` 타입 추가 (`x`, `y`, `type: 'flag' | 'cone' | 'marker'`)
- [x] 1.2 `DEFAULT_RACE_CONFIG` 값 변경: trackLength 6000, minFirstFinish 15000, maxDuration 45000, forceMin 0.001, forceMax 0.008, forceInterval 200, boostForce 0.02

## 2. 시뮬레이션 방향 반전

- [x] 2.1 `setupRacers`: 초기 위치를 `y = 50` (상단)으로 변경, 레이서 x좌표에 약간의 랜덤 오프셋 추가
- [x] 2.2 `setupRacers`: 각 레이서에 산탄총 초기 임펄스 적용 (중심 하향 ±30°, 랜덤 magnitude 0.005~0.015)
- [x] 2.3 `applyRandomForces`: `fy`를 양수(+y, 아래 방향)로 변경, `fx` 유지
- [x] 2.4 `applyBoostToRemaining`: boost 방향을 `+y`로 변경
- [x] 2.5 `checkFinishLine`: 결승 조건을 `y >= trackLength`로 변경

## 3. 데코레이션 시스템

- [x] 3.1 `RaceSimulation`에 데코 생성 로직 추가: 시뮬레이션 초기화 시 20~30개 랜덤 Decoration 생성
- [x] 3.2 `RaceSimulation`에 `getDecorations()` getter 추가
- [x] 3.3 `Renderer`에 `drawDecorations(decorations, trackLength, trackWidth)` 메서드 추가 — flag(삼각 깃발), cone(삼각 콘), marker(점선 원) 타입별 렌더링
- [x] 3.4 `Renderer.render()`에서 drawTrack 이후, drawRacers 이전에 drawDecorations 호출

## 4. 렌더러 방향 반전

- [x] 4.1 `drawTrack`: 출발선(점선)을 상단(y=50)으로, 결승선(체커보드)을 하단(y=trackLength)으로 이동
- [x] 4.2 `drawTrack`: 체커보드 패턴을 하단 결승선 주변으로 재배치

## 5. 반응형 트랙 너비

- [x] 5.1 `race-canvas.tsx`에서 캔버스 컨테이너 너비 측정 후 `config.trackWidth`로 전달 (max 800px cap)

## 6. 카메라 조정

- [x] 6.1 `camera.ts` `resetToFullTrack`: 새 방향에 맞게 초기 위치 조정
- [x] 6.2 카메라 추적 로직 검증 — min/max 기반이므로 방향 반전에 자동 적응하는지 확인

## 7. 통합 테스트 및 튜닝

- [x] 7.1 경주 실행하여 ~30초 안에 자연스럽게 완주되는지 확인, forceMin/Max 미세 조정
- [x] 7.2 산탄총 출발 시 레이서가 벽 밖으로 나가지 않는지 확인
- [x] 7.3 데코 오브젝트가 이동감을 제공하는지 시각적 확인
