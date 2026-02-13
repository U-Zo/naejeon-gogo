## Context

현재 경주 엔진은 Matter.js 물리 시뮬레이션 기반으로 아래→위(y 감소) 방향으로 동작한다. 레이서는 `y = trackLength - 50` 에서 출발하여 `y <= 0`에 도달하면 결승. 트랙 너비는 고정 500px이며 레이서는 균등 레인에 정렬된다. 경주 시간은 최소 60초, 최대 120초.

핵심 파일:
- `engine/types.ts` — RaceConfig, DEFAULT_RACE_CONFIG
- `engine/race-simulation.ts` — 물리 시뮬레이션 (setupTrack, setupRacers, applyRandomForces, checkFinishLine)
- `engine/renderer.ts` — Canvas 2D 렌더링 (drawTrack, drawRacers)
- `engine/camera.ts` — 카메라 추적/줌
- `components/race-canvas.tsx` — React 컴포넌트, 시뮬레이션 루프

## Goals / Non-Goals

**Goals:**
- 경주 방향을 위→아래(y 증가)로 반전
- 출발 시 산탄총처럼 랜덤 각도/속도로 임펄스를 가해 분산 출발
- 트랙 중간에 데코 오브젝트를 배치하여 이동감 제공
- 트랙 가로 너비를 컨테이너 너비에 반응형으로 맞춤
- 경주 시간을 ~30초로 단축

**Non-Goals:**
- 데코 오브젝트와 레이서 간 물리 충돌 (순수 시각적 요소)
- 3D 렌더링 또는 WebGL 전환
- 팀 배정 로직/결과 UI 변경

## Decisions

### 1. 방향 반전 전략: y축 부호 반전

**결정**: 출발점을 `y = 50`(상단), 결승선을 `y = trackLength`(하단)로 변경. 힘 방향도 양수(+y)로 반전.

**대안**: Canvas transform으로 화면만 뒤집기 → 텍스트/UI도 뒤집혀서 복잡도 증가. 엔진 수준에서 좌표를 바꾸는 것이 깔끔.

**영향 범위**:
- `setupRacers`: 초기 y 좌표를 `50`으로
- `applyRandomForces`: `fy`를 양수로
- `applyBoostToRemaining`: boost y를 양수로
- `checkFinishLine`: `y >= trackLength` 조건으로
- `drawTrack`: 출발선 상단, 결승선 하단, 체커 패턴 하단
- `camera.ts`: 추적 로직은 min/max 기반이므로 자동 적응, 다만 `resetToFullTrack` 초기값 조정

### 2. 산탄총 출발: 초기 임펄스 분산

**결정**: `setupRacers` 후 각 레이서에 랜덤 각도(중심 하향 ± 30°)와 랜덤 세기의 초기 임펄스를 적용. 시작 위치는 트랙 상단 중앙 근처에 약간의 위치 랜덤을 부여.

```
angle = -π/2 + random(-π/6, π/6)  // 중심이 아래 방향, ±30도 분산
magnitude = random(0.005, 0.015)
fx = cos(angle) * magnitude
fy = -sin(angle) * magnitude  // canvas 좌표계에서 아래가 +y
```

**대안**: 레인 정렬 유지 + 랜덤 시간차 출발 → 산탄총 느낌이 안 남. 초기 임펄스가 시각적 임팩트가 큼.

### 3. 데코 오브젝트 시스템: 순수 렌더링 레이어

**결정**: 시뮬레이션 초기화 시 랜덤 좌표/타입의 데코 목록을 생성하여 `Renderer`에 전달. 물리 월드에는 추가하지 않음 (충돌 없음).

**데코 타입 및 렌더링**:
- 삼각형 깃발 (🚩 형태)
- 원형 원뿔 (콘)
- 작은 점선 마커
- 타입별 색상 차별화, 트랙 전체에 20~30개 랜덤 분포

**구조**:
```ts
type Decoration = {
  x: number;
  y: number;
  type: 'flag' | 'cone' | 'marker';
};
```

`Renderer.drawDecorations(decorations, trackLength, trackWidth)` 메서드 추가. `drawTrack` 이후, `drawRacers` 이전에 호출하여 레이서 아래에 깔리도록 함.

**대안**: 물리 바디로 충돌 가능한 장애물 → Non-Goal로 제외. 순수 시각이 구현 단순하고 경주 공정성 유지.

### 4. 반응형 트랙 너비: config에 trackWidth를 동적 주입

**결정**: `RaceSimulation` 생성 시 `config.trackWidth`를 캔버스 컨테이너의 실제 너비로 전달. `DEFAULT_RACE_CONFIG.trackWidth`는 fallback 값으로 유지하되, `RaceCanvas`에서 컨테이너 너비를 측정하여 override.

```tsx
// race-canvas.tsx
const containerWidth = canvasRef.current.getBoundingClientRect().width;
const sim = new RaceSimulation(members, { trackWidth: containerWidth });
```

벽 위치, 레인 너비, 카메라 범위 모두 `config.trackWidth`를 참조하므로 자동 적응.

### 5. 30초 경주 시간: config 파라미터 조정

**결정**: DEFAULT_RACE_CONFIG 변경:
```
trackLength: 6000       (12000 → 6000, 절반)
minFirstFinish: 15_000  (60_000 → 15_000)
maxDuration: 45_000     (120_000 → 45_000, 안전 마진)
forceMin: 0.001         (0.0003 → 0.001, 3.3배)
forceMax: 0.008         (0.003 → 0.008, 2.7배)
forceInterval: 200      (250 → 200, 약간 빠르게)
boostForce: 0.02        (0.01 → 0.02)
```

트랙 길이를 줄이고 힘을 키워서 ~30초 안에 자연스럽게 완주되도록 조정. `earlySpeedLimited` 로직도 비율 기반이므로 자동 적응.

## Risks / Trade-offs

- **[리스크] 30초 파라미터 튜닝**: 랜덤 특성상 경주마다 시간 편차 존재 → 실제 테스트로 forceMin/Max 미세 조정 필요. maxDuration 45초로 안전 마진 확보.
- **[리스크] 반응형 너비 + 물리 시뮬레이션**: 매우 넓은 화면에서 레이서가 너무 퍼질 수 있음 → trackWidth에 max cap (예: 800px) 적용.
- **[트레이드오프] 데코 오브젝트 비충돌**: 시각적 요소만이므로 레이서가 데코 위를 통과함 → 이동감 제공이 목적이므로 수용 가능.
- **[트레이드오프] BREAKING 방향 변경**: 기존 스펙의 "left to right" 문구 수정 필요 → specs delta에서 반영.
