## Why

현재 경주 시뮬레이션은 아래→위(y 감소) 방향으로 이동하며, 출발 시 레이서들이 레인에 정렬된 채 시작한다. 시각적으로 단조롭고 경주 시간이 60초~2분으로 길어 긴장감이 떨어진다. 위→아래 방향으로 전환하고, 산탄총처럼 랜덤 발사 출발 + 중간 장애물/데코 오브젝트로 이동감을 강화하면 더 역동적이고 재미있는 경주가 된다.

## What Changes

- **BREAKING**: 경주 이동 방향을 위→아래(y 증가)로 반전 — 출발선(상단), 결승선(하단)
- 출발 시 레이서들을 레인 정렬 대신 산탄총처럼 랜덤 각도/속도로 발사 (초기 임펄스 분산)
- 트랙 중간에 시각적 오브젝트(나무, 바위, 깃발 등 데코)를 랜덤 배치하여 이동감(parallax) 제공
- 트랙 가로 길이를 캔버스/컨테이너 너비에 맞게 반응형으로 확장
- 경주 시간을 ~30초로 단축 (minFirstFinish, maxDuration, 힘 파라미터 조정)
- 카메라/렌더링이 새로운 방향과 반응형 너비에 맞도록 업데이트

## Capabilities

### New Capabilities
- `race-track-decorations`: 트랙 위에 랜덤 배치되는 시각적 데코 오브젝트 시스템 (이동감 연출)

### Modified Capabilities
- `race-roulette`: 이동 방향 반전, 산탄총 출발, 30초 경주 시간, 반응형 트랙 너비로 요구사항 변경

## Impact

- **엔진 레이어**: `race-simulation.ts` — setupTrack(벽 방향), setupRacers(초기 위치/임펄스), applyRandomForces(힘 방향), checkFinishLine(결승 조건), config 기본값
- **렌더러**: `renderer.ts` — drawTrack(출발/결승선 위치, 데코 오브젝트 렌더링), drawRacers(방향 반영)
- **카메라**: `camera.ts` — 새 방향에 맞는 추적 로직
- **타입/설정**: `types.ts` — DEFAULT_RACE_CONFIG 값 변경, 데코 관련 타입 추가
- **캔버스 컴포넌트**: `race-canvas.tsx` — 반응형 너비 전달
- **기존 스펙**: race-roulette 스펙의 방향/시간 요구사항 수정 필요
