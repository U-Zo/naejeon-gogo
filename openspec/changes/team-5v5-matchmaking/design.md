## Context

사내/커뮤니티 LoL 5v5 내전을 위한 팀 매칭 웹 앱. 현재는 수동으로 팀을 나누고 있어 밸런스가 맞지 않고 시간이 소요된다. 멤버 풀 관리, MMR 기반 밸런스 매칭, 전적 기록을 하나의 웹 앱으로 제공한다.

**제약 조건:**
- 모바일 우선 디자인 (PC에서도 좁은 뷰)
- JSON 로컬 파일 저장 (DB 없음)
- TanStack Start + Radix UI + vanilla-extract
- LoL 다크 테마

## Goals / Non-Goals

**Goals:**
- 10명의 참가자를 실력(MMR)과 포지션 밸런스를 고려해 5:5 팀으로 자동 배정
- 멤버 풀 관리 (고정 멤버 CRUD, 임시 참가자)
- 내전 전적 기반 MMR 자동 산출 및 업데이트
- 경기 결과(승/패) 기록 및 조회
- LoL 느낌의 다크 테마 UI

**Non-Goals:**
- 실시간 멀티유저 동시 접속 (단일 사용자 운영 가정)
- LoL API 연동 (수동 데이터 관리)
- 챔피언 선택/밴픽 시뮬레이션
- 사용자 인증/로그인 시스템

## Decisions

### 1. 프레임워크: TanStack Start

**선택**: TanStack Start (풀스택 React 프레임워크)
**이유**: 사용자 요청. 서버 사이드 로직(JSON 파일 I/O)과 클라이언트 UI를 하나의 프로젝트에서 관리 가능.
**대안 고려**: Next.js (더 넓은 생태계), Vite+Express (더 유연) → TanStack Start가 사용자 선호.

### 2. UI 라이브러리: Radix UI + vanilla-extract

**선택**: Radix UI 프리미티브 + vanilla-extract (타입 안전 CSS-in-JS)
**이유**: 사용자 요청. Radix UI는 접근성 내장, headless 컴포넌트. vanilla-extract는 TypeScript 기반 정적 CSS 추출로 타입 안전성과 제로 런타임 성능을 제공. LoL 테마 변수를 타입 안전하게 관리 가능.
**대안 고려**: Tailwind CSS (유틸리티 클래스 기반, 빠른 프로토타이핑), CSS Modules (별도 의존성 없음) → vanilla-extract가 TypeScript 프로젝트에서 가장 안전.

### 3. 데이터 저장: JSON 파일

**선택**: 서버 사이드 JSON 파일 저장 (`data/members.json`, `data/matches.json`)
**이유**: 사용자 요청. DB 설치 없이 간단히 운영 가능. TanStack Start의 서버 함수에서 fs로 읽기/쓰기.
**대안 고려**: SQLite (쿼리 유연), localStorage (서버 불필요) → JSON 파일이 가장 단순하면서 서버에서 안전하게 관리 가능.

### 4. MMR 시스템: Elo 기반 단순 레이팅

**선택**: 단순화된 Elo 레이팅 시스템
- 초기 MMR: 1000
- 승리 시 +25, 패배 시 -25 (기본값)
- K-factor 고정 (복잡한 가변 K 미적용)

**이유**: 내전 규모(10명 내외)에서는 복잡한 Elo 변동보다 단순하고 예측 가능한 시스템이 적합.
**대안 고려**: TrueSkill (더 정확하지만 복잡), Glicko-2 (불확실성 반영) → 내전 규모에서 과잉.

### 5. 매칭 알고리즘: 총 MMR 밸런스 + 포지션 배정

**선택**: 2단계 매칭
1. **포지션 배정**: 참가자 10명의 주/가능 포지션을 고려해 각 팀 5포지션(탑/정글/미드/원딜/서포터)에 배정
2. **팀 밸런스**: 가능한 팀 조합 중 양 팀 총 MMR 차이가 최소인 조합 선택
3. **여러 후보 제시**: 상위 3개 밸런스 조합을 보여주고 운영자가 선택

**이유**: 포지션을 먼저 배정해야 실제 플레이 가능한 팀이 나온다. MMR 밸런스만으로는 모두 같은 포지션에 몰릴 수 있다.
**대안 고려**: 완전 랜덤 후 밸런스 확인 → 포지션 무시 문제. 드래프트 방식 → 자동화 목적에 부적합.

### 6. 라우팅 구조: 탭 기반 SPA

**선택**: 단일 페이지, 3개 탭
- `/` (매칭 탭 - 기본)
- `/members` (멤버 관리 탭)
- `/history` (전적 탭)

**이유**: 모바일 우선 설계에서 하단 탭 네비게이션이 자연스럽고, TanStack Start의 파일 기반 라우팅과 호환.

### 7. 도메인 모듈 아키텍처: 인터페이스 기반 경계 분리

**선택**: 3개 도메인 모듈로 분리, 모듈 간 통신은 인터페이스(TypeScript interface/type)를 통해서만 수행.
**이유**: 모듈 간 결합도를 낮추고, 각 모듈을 독립적으로 테스트/교체 가능하게 함. 저장소 구현을 인터페이스 뒤에 숨겨 추후 JSON → DB 전환 시 도메인 로직 변경 없이 교체 가능.
**대안 고려**: 단일 모듈 (간단하지만 성장 시 엉킴), 레이어드 아키텍처 (과잉) → 모듈별 경계 분리가 이 규모에서 적절.

**디렉토리 구조:**
```
src/
├── server/
│   ├── shared/
│   │   └── types.ts                    # Position, TeamSide 등 공유 타입
│   ├── member/
│   │   ├── types.ts                    # Member 엔티티, MemberInput
│   │   ├── member.repository.ts        # IMemberRepository 인터페이스
│   │   ├── member.repository.json.ts   # IMemberRepository JSON 구현
│   │   ├── member.service.ts           # MemberService (비즈니스 로직)
│   │   └── member.controller.ts        # createServerFn (멤버 CRUD)
│   ├── matchmaking/
│   │   ├── types.ts                    # MatchCandidate, PositionAssignment
│   │   ├── matchmaking.service.ts      # IMatchmakingService 인터페이스 + 구현
│   │   ├── position-assigner.ts        # IPositionAssigner 인터페이스 + 구현
│   │   ├── balance-calculator.ts       # IBalanceCalculator 인터페이스 + 구현
│   │   └── matchmaking.controller.ts   # createServerFn (매칭 생성/리롤/확정)
│   └── match/
│       ├── types.ts                    # Match, TeamSlot, MmrDelta
│       ├── match.repository.ts         # IMatchRepository 인터페이스
│       ├── match.repository.json.ts    # IMatchRepository JSON 구현
│       ├── match.service.ts            # MatchService (비즈니스 로직)
│       ├── mmr-calculator.ts           # IMmrCalculator 인터페이스 + 구현
│       └── match.controller.ts         # createServerFn (결과 기록, 전적 조회)
└── client/
    ├── components/                    # 공용 Radix UI 프리미티브 래퍼
    │   ├── Button.tsx
    │   ├── Dialog.tsx
    │   ├── Checkbox.tsx
    │   ├── Select.tsx
    │   ├── Tabs.tsx
    │   ├── Badge.tsx
    │   └── Layout.tsx                 # 앱 셸 (탭 네비게이션, 모바일 레이아웃)
    ├── pages/
    │   ├── matchmaking/               # 매칭 탭
    │   │   ├── MatchmakingPage.tsx     # 탭 페이지 (상태 관리, 서버 함수 호출)
    │   │   ├── ParticipantSelector.tsx # 10명 선택 체크박스 리스트
    │   │   ├── CandidateList.tsx       # 매칭 후보 3개 목록
    │   │   ├── CandidateCard.tsx       # 단일 후보 카드 (팀A vs 팀B)
    │   │   ├── TeamDisplay.tsx         # 팀 멤버 + 포지션 + MMR 표시
    │   │   └── MatchResultInput.tsx    # 승리 팀 선택 버튼
    │   ├── members/                   # 멤버관리 탭
    │   │   ├── MembersPage.tsx         # 탭 페이지 (상태 관리)
    │   │   ├── MemberList.tsx          # 멤버 목록 테이블/카드
    │   │   ├── MemberCard.tsx          # 단일 멤버 카드 (이름, 포지션, MMR)
    │   │   ├── MemberForm.tsx          # 등록/수정 폼 (이름, 포지션, 임시 토글)
    │   │   ├── MemberDetail.tsx        # 개인 상세 (전적, 승률, MMR)
    │   │   └── DeleteConfirmDialog.tsx # 삭제 확인 다이얼로그
    │   └── history/                   # 전적 탭
    │       ├── HistoryPage.tsx         # 탭 페이지 (상태 관리)
    │       ├── MatchList.tsx           # 경기 목록 (날짜, 팀, 승패)
    │       └── MatchDetail.tsx         # 경기 상세 (팀 구성, MMR 변동)
    └── styles/                         # vanilla-extract 스타일
        ├── theme.css.ts               # LoL 다크 테마 변수 (색상, 폰트, 간격)
        ├── sprinkles.css.ts           # 유틸리티 스타일 (선택적)
        └── global.css.ts              # 글로벌 리셋/기본 스타일
```

**모듈 간 의존성 규칙:**

서버 내부 (`server/`):
- 각 모듈은 서로의 **인터페이스(types)**만 import 가능. 구현체를 직접 import 금지.
- `server/shared/types.ts`는 모든 모듈이 공유하는 기본 타입만 정의.
- `matchmaking` 모듈은 `Member` 타입을 import하되, `IMemberRepository`를 직접 의존하지 않음. 서비스 함수 인자로 멤버 목록을 전달받음.
- `match` 모듈은 경기 결과 기록 시 MMR 변동값을 반환. 실제 멤버 MMR 업데이트는 호출측(controller)에서 `MemberService`를 통해 수행.
- `*.repository.json.ts`는 같은 모듈의 `*.repository.ts` 인터페이스를 구현. 서비스는 인터페이스만 의존.
- `*.controller.ts`는 각 모듈의 진입점 — `createServerFn`으로 서비스를 호출하고 repository 구현체를 주입.

클라이언트-서버 경계:
- `client/*`는 `*.controller.ts`의 서버 함수만 호출. 서비스/repository를 직접 import 금지.
- `server/*/types.ts`의 타입만 UI에서 import 가능 (표시용 타입 공유).

UI 내부 (`ui/`):
- `client/components/`는 Radix UI 프리미티브를 래핑한 공용 컴포넌트. 비즈니스 로직 없음, props로만 동작.
- `client/pages/*/Page.tsx`만 서버 함수를 호출하고 상태를 관리. 하위 컴포넌트는 props를 받는 순수 표현 컴포넌트.
- page 간 컴포넌트 직접 import 금지. 공유가 필요하면 `client/components/`로 승격.

**모듈 간 통신 흐름 (예: 매칭 → 결과 기록):**
```
[UI] matchmaking 탭에서 확정
  → [server/matchmaking.api] confirmMatch()
    → [domain/match/MatchService].recordMatch(teamA, teamB)
    → [domain/match/MmrCalculator].calculate(winner, loser) → MmrDelta[]
    → [domain/member/MemberService].applyMmrDeltas(deltas)
```

**핵심 인터페이스:**
```typescript
// domain/member/member.repository.ts
interface IMemberRepository {
  findAll(): Promise<Member[]>
  findById(id: string): Promise<Member | null>
  save(member: Member): Promise<void>
  delete(id: string): Promise<void>
}

// domain/match/match.repository.ts
interface IMatchRepository {
  findAll(): Promise<Match[]>
  findById(id: string): Promise<Match | null>
  save(match: Match): Promise<void>
}

// domain/matchmaking/matchmaking.service.ts
interface IMatchmakingService {
  generateCandidates(members: Member[]): MatchCandidate[]
}

// domain/matchmaking/position-assigner.ts
interface IPositionAssigner {
  assign(members: Member[]): PositionAssignment[] | null
}

// domain/matchmaking/balance-calculator.ts
interface IBalanceCalculator {
  findBestSplits(assignments: PositionAssignment[]): MatchCandidate[]
}

// domain/match/mmr-calculator.ts
interface IMmrCalculator {
  calculate(winners: string[], losers: string[]): MmrDelta[]
}
```

### 8. 데이터 모델

```typescript
// domain/shared/types.ts
type Position = "top" | "jungle" | "mid" | "adc" | "support"
type TeamSide = "A" | "B"

// domain/member/types.ts
type Member = {
  id: string
  name: string
  mainPosition: Position
  subPositions: Position[]
  mmr: number
  isTemporary: boolean
  createdAt: string // ISO
}

// domain/match/types.ts
type Match = {
  id: string
  date: string // ISO
  teamA: TeamSlot[]
  teamB: TeamSlot[]
  winner: TeamSide
}

type TeamSlot = {
  memberId: string
  position: Position
}

type MmrDelta = {
  memberId: string
  delta: number // +25 or -25
}

// domain/matchmaking/types.ts
type PositionAssignment = {
  memberId: string
  assignedPosition: Position
}

type MatchCandidate = {
  teamA: TeamSlot[]
  teamB: TeamSlot[]
  mmrDiff: number
  teamATotal: number
  teamBTotal: number
}
```

## Risks / Trade-offs

- **[JSON 파일 동시 접근]** → 단일 사용자 운영 가정으로 문제 없음. 추후 필요 시 파일 락 추가.
- **[MMR 정확도]** → 고정 K-factor Elo는 소규모 내전에서 수렴이 느릴 수 있음 → 초기 MMR을 운영자가 수동 조정 가능하게 제공.
- **[매칭 알고리즘 성능]** → 10명 조합(C(10,5)=252)은 브루트포스로 충분. 참가자 수가 크게 늘면 최적화 필요.
- **[데이터 유실]** → JSON 파일 백업 없음 → 사용자에게 수동 백업 안내. 추후 export/import 기능 고려.
