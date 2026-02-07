## 1. 프로젝트 초기 설정

- [x] 1.1 TanStack Start 프로젝트 생성 및 기본 구조 세팅
- [x] 1.2 Radix UI, vanilla-extract 의존성 설치 및 설정
- [x] 1.3 디렉토리 구조 생성 (server/shared, server/member, server/matchmaking, server/match, client/)
- [x] 1.4 LoL 다크 테마 vanilla-extract 설정 (색상 팔레트, 폰트, 다크 배경 테마 변수)
- [x] 1.5 탭 기반 레이아웃 구성 (매칭 / 멤버관리 / 전적) 및 라우팅 설정
- [x] 1.6 모바일 우선 반응형 레이아웃 (좁은 뷰) 적용

## 2. 공유 타입 및 인터페이스 정의

- [x] 2.1 server/shared/types.ts — 공유 타입 정의 (Position, TeamSide)
- [x] 2.2 server/member/types.ts — Member 엔티티 타입 정의
- [x] 2.3 server/member/member.repository.ts — IMemberRepository 인터페이스 정의
- [x] 2.4 server/match/types.ts — Match, TeamSlot, MmrDelta 타입 정의
- [x] 2.5 server/match/match.repository.ts — IMatchRepository 인터페이스 정의
- [x] 2.6 server/matchmaking/types.ts — PositionAssignment, MatchCandidate 타입 정의
- [x] 2.7 server/matchmaking/matchmaking.service.ts — IMatchmakingService 인터페이스 정의
- [x] 2.8 server/matchmaking/position-assigner.ts — IPositionAssigner 인터페이스 정의
- [x] 2.9 server/matchmaking/balance-calculator.ts — IBalanceCalculator 인터페이스 정의
- [x] 2.10 server/match/mmr-calculator.ts — IMmrCalculator 인터페이스 정의

## 3. 서비스 구현

- [x] 3.1 server/member/member.service.ts — MemberService 구현 (CRUD, MMR 적용, 유효성 검사)
- [x] 3.2 server/matchmaking/position-assigner.ts — PositionAssigner 구현 (주 포지션 우선 → 가능 포지션 대체)
- [x] 3.3 server/matchmaking/balance-calculator.ts — BalanceCalculator 구현 (총 MMR 차이 최소화, 상위 3개 후보)
- [x] 3.4 server/matchmaking/matchmaking.service.ts — MatchmakingService 구현 (PositionAssigner + BalanceCalculator 조합)
- [x] 3.5 server/match/mmr-calculator.ts — MmrCalculator 구현 (승리 +25, 패배 -25, 최소 0)
- [x] 3.6 server/match/match.service.ts — MatchService 구현 (경기 기록, MMR 변동값 산출)

## 4. Repository 구현 (JSON 저장소)

- [x] 4.1 server/member/member.repository.json.ts — IMemberRepository JSON 구현 (원자적 파일 쓰기, 미존재 시 초기화)
- [x] 4.2 server/match/match.repository.json.ts — IMatchRepository JSON 구현

## 5. 컨트롤러 (서버 함수 진입점)

- [x] 5.1 server/member/member.controller.ts — 멤버 CRUD createServerFn (repository 주입, 서비스 호출)
- [x] 5.2 server/matchmaking/matchmaking.controller.ts — 매칭 생성/리롤/확정 createServerFn
- [x] 5.3 server/match/match.controller.ts — 경기 결과 기록, 전적 조회 createServerFn (MatchService + MemberService 조합)

## 6. UI — 멤버 관리 탭

- [x] 6.1 멤버 등록 폼 UI (이름, 주 포지션, 가능 포지션, 임시 참가자 토글)
- [x] 6.2 멤버 등록 기능 연동 (서버 함수 호출, 유효성 검사)
- [x] 6.3 멤버 목록 UI (이름, 주 포지션, MMR, 승/패 전적, 임시 참가자 구분 표시)
- [x] 6.4 멤버 수정 기능 (포지션 변경, MMR 수동 조정)
- [x] 6.5 멤버 삭제 기능 (확인 다이얼로그 포함)
- [x] 6.6 개인 전적 조회 (총 승수, 패수, 승률, 현재 MMR)

## 7. UI — 매칭 탭

- [x] 7.1 참가자 10명 선택 UI (멤버 풀에서 체크박스 선택, 10명 검증)
- [x] 7.2 매칭 결과 표시 UI (3개 후보: 팀A/팀B 멤버, 포지션, MMR, 팀 총 MMR)
- [x] 7.3 후보 선택 및 확정 기능
- [x] 7.4 리롤 기능 (매칭 재실행)
- [x] 7.5 경기 결과 입력 UI (팀A 승리 / 팀B 승리 버튼)
- [x] 7.6 포지션 배정 불가 시 오류 메시지 처리

## 8. UI — 전적 탭

- [x] 8.1 전적 목록 UI (최근 경기순: 날짜, 팀A vs 팀B, 승리 팀)
- [x] 8.2 경기 상세 조회 UI (팀 구성, 포지션, 승패, MMR 변동)
