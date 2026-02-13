## Context

현재 내전고고 앱은 밸런스 기반 매치메이킹(`/`)만 제공한다. 새 `/race` 페이지에서 물리 엔진 기반 달리기 경주 애니메이션으로 풀랜덤 팀을 구성하는 기능을 추가한다.

기존 구조:
- 라우팅: TanStack Router 파일 기반 (`src/routes/`)
- 네비게이션: `Layout` 컴포넌트의 `tabs` 배열
- 매치 확정: `createMatch` API (teamA, teamB 슬롯 전달)
- 멤버 조회: `useMembers()` hook + `membersQueryOptions`

## Goals / Non-Goals

**Goals:**
- 물리 엔진으로 구동되는 달리기 경주 애니메이션 구현
- 카메라 시스템: 전체 조감 → 골인 시 남은 레이서에 줌인
- 경주 시간 1분~2분 유지
- 경주 결과로 풀랜덤 팀 배정 후 기존 매치 생성 API로 확정
- 기존 매칭 페이지와 독립적으로 동작

**Non-Goals:**
- 서버 사이드 물리 시뮬레이션 (클라이언트 전용)
- 밸런스 고려 (순수하게 물리 시뮬레이션 결과에 의존)
- 3D 렌더링 (2D Canvas)
- 멤버별 캐릭터 커스터마이징 (1차 스코프 외)
- 리플레이 저장

## Decisions

### 1. 물리 엔진: Matter.js

**선택**: Matter.js
**대안**: Planck.js (Box2D 포트), P2.js (미유지보수)

**근거**:
- 주간 다운로드 162K+, GitHub 스타 17K+ — 가장 큰 커뮤니티와 문서
- 간결한 API로 빠른 프로토타이핑 가능
- 커스텀 렌더러 연동이 쉬움 (카메라 시스템 직접 구현 필요)
- TypeScript 타입 지원 (`@types/matter-js`)
- Planck.js는 더 정확한 물리를 제공하지만, 경주 연출 수준에서는 Matter.js로 충분

### 2. 렌더링: 커스텀 Canvas 렌더러

**선택**: Canvas 2D API + requestAnimationFrame 루프 직접 구현
**대안**: Matter.js 내장 렌더러, PixiJS

**근거**:
- 카메라(뷰포트) 제어를 직접 해야 하므로 내장 렌더러 부적합
- PixiJS는 이 프로젝트 규모에 비해 과도한 의존성
- Canvas 2D로 레이서(원형/사각형 바디 + 이름 라벨) 렌더링 충분
- `ctx.save()` → `ctx.translate/scale` → `ctx.restore()` 패턴으로 카메라 변환 구현

### 3. 레이스 메카닉

**트랙 구조**:
- 수평 트랙, 왼쪽 출발선 → 오른쪽 결승선
- 트랙 길이: 물리 단위로 충분히 길게 설정 (시간 조절용 주요 파라미터)
- 레인 없음 — 레이서들이 자유롭게 이동하며 서로 충돌 가능
- 트랙 상하 벽으로 이탈 방지

**레이서 물리**:
- 각 레이서는 Matter.js Body (원형)
- 주기적으로 랜덤 크기의 수평 힘(force) 적용 → 가속
- 공기저항(frictionAir)으로 최고 속도 제한
- 레이서 간 충돌 활성화 → 부딪히면 속도 변화
- 랜덤 이벤트(부스트/감속)로 역전 가능성 부여

**시간 조절 (1분~2분)**:
- `trackLength`, `forceRange`, `frictionAir`, `forceInterval` 파라미터 조합으로 조절
- 개발 시 시뮬레이션 테스트를 통해 파라미터 튜닝
- 안전장치: 최대 시간(2분) 초과 시 남은 레이서에 부스트 적용하여 강제 종료

### 4. 카메라 시스템

**동작 방식**:
- **초기**: 전체 트랙이 보이도록 줌아웃 (모든 레이서 + 결승선 포함)
- **경주 중**: 가장 앞선 레이서와 가장 뒤처진 레이서의 범위에 맞춰 뷰포트 조절
- **골인 시작**: 골인한 레이서는 트래킹 대상에서 제외 → 남은 레이서들만 추적
- **후반부**: 남은 레이서 수가 줄수록 자연스럽게 줌인 (레이서 간 거리가 가까우므로)
- **전환**: lerp(선형 보간)로 카메라 이동/줌 변환을 부드럽게

**구현**:
```
Camera {
  x, y: number       // 뷰포트 중심
  zoom: number        // 확대 비율
  update(racers[])    // 매 프레임 남은 레이서 기준으로 x, y, zoom 재계산
}
```

### 5. 페이지 구조 & 플로우

**Phase 1 — 멤버 선택** (`select`):
- 기존 매칭 페이지의 `SelectPhase` 컴포넌트 패턴 재활용
- 10명 선택 후 "경주 시작" 버튼

**Phase 2 — 경주** (`race`):
- Canvas 전체 화면 렌더링
- 물리 시뮬레이션 시작, 애니메이션 루프
- 골인 순서대로 순위 표시 (사이드 패널 또는 오버레이)
- 전원 골인 시 자동으로 결과 Phase 전환

**Phase 3 — 결과** (`result`):
- 순위 리스트 + 팀 배정 결과 (1~5위 팀A, 6~10위 팀B)
- "매치 확정" → 기존 `createMatch` API 호출
- "다시 경주" → Phase 2로 돌아가 새 시뮬레이션
- "돌아가기" → Phase 1로 복귀

### 6. 파일 구조

```
src/
├── routes/race.tsx                           # 라우트 정의
├── client/pages/race/
│   ├── race-page.tsx                         # 메인 페이지 (phase 관리)
│   ├── race-page.css.ts                      # 페이지 스타일
│   ├── components/
│   │   ├── race-select-phase.tsx             # 멤버 선택 (Phase 1)
│   │   ├── race-canvas.tsx                   # Canvas + 애니메이션 루프 (Phase 2)
│   │   └── race-result-phase.tsx             # 결과 표시 (Phase 3)
│   └── engine/
│       ├── race-simulation.ts                # Matter.js 시뮬레이션 설정 & 루프
│       ├── camera.ts                         # 카메라 시스템
│       ├── renderer.ts                       # Canvas 렌더링 로직
│       └── types.ts                          # Racer, RaceConfig 등 타입
```

### 7. 네비게이션 통합

`Layout` 컴포넌트의 `tabs` 배열에 새 탭 추가:
```ts
{ to: '/race', label: '경주', icon: RaceIcon }
```

## Risks / Trade-offs

- **[물리 시뮬레이션 시간 편차]** → 파라미터 튜닝으로 1~2분 범위 확보 + 최대 시간 초과 시 부스트 강제 종료 안전장치
- **[모바일 성능]** → Canvas 2D + 10개 바디 정도는 모바일에서도 60fps 가능. Matter.js는 가벼운 엔진. 성능 이슈 시 렌더링 프레임 스킵 적용
- **[번들 사이즈 증가]** → Matter.js ~72KB(gzipped). 레이스 페이지를 code-split하여 초기 로딩에 영향 없도록 처리
- **[경주가 예측 가능해질 위험]** → 랜덤 이벤트(부스트/감속)와 레이서 간 충돌로 매번 다른 전개 보장
