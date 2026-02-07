## ADDED Requirements

### Requirement: Turso DB 연결 관리
시스템은 `@libsql/client`를 사용하여 Turso DB에 연결하는 클라이언트를 제공해야 한다(SHALL). 클라이언트는 환경변수 `TURSO_DATABASE_URL`과 `TURSO_AUTH_TOKEN`으로 설정된다(SHALL).

#### Scenario: 환경변수가 올바르게 설정된 경우
- **WHEN** `TURSO_DATABASE_URL`과 `TURSO_AUTH_TOKEN`이 설정되어 있을 때
- **THEN** Turso 클라이언트가 정상적으로 생성되어야 한다

#### Scenario: 환경변수가 누락된 경우
- **WHEN** `TURSO_DATABASE_URL` 또는 `TURSO_AUTH_TOKEN`이 설정되지 않았을 때
- **THEN** 앱 시작 시 에러를 발생시켜야 한다

### Requirement: DB 스키마 자동 초기화
앱이 시작될 때 필요한 테이블이 존재하지 않으면 자동으로 생성해야 한다(SHALL). `CREATE TABLE IF NOT EXISTS` 구문을 사용한다(SHALL).

#### Scenario: 최초 실행 시 테이블 생성
- **WHEN** 앱이 처음 시작되어 테이블이 없을 때
- **THEN** `members`, `matches`, `match_slots` 테이블이 생성되어야 한다

#### Scenario: 이미 테이블이 존재할 때
- **WHEN** 앱이 시작되고 테이블이 이미 존재할 때
- **THEN** 기존 테이블과 데이터에 영향을 주지 않아야 한다

### Requirement: Members 테이블 스키마
`members` 테이블은 다음 컬럼을 가져야 한다(SHALL): `id` (TEXT PRIMARY KEY), `name` (TEXT NOT NULL), `mainPosition` (TEXT NOT NULL), `subPositions` (TEXT NOT NULL, JSON 배열 문자열), `mmr` (INTEGER NOT NULL), `isTemporary` (INTEGER NOT NULL, 0 또는 1), `createdAt` (TEXT NOT NULL), `streak` (TEXT, nullable JSON 문자열).

#### Scenario: Member 저장 및 조회
- **WHEN** Member 객체를 저장하고 다시 조회할 때
- **THEN** 모든 필드가 원본과 동일하게 복원되어야 한다 (subPositions 배열, streak 객체 포함)

### Requirement: Matches 및 Match Slots 테이블 스키마
`matches` 테이블은 `id` (TEXT PRIMARY KEY), `date` (TEXT NOT NULL), `winner` (TEXT NOT NULL) 컬럼을 가져야 한다(SHALL). `match_slots` 테이블은 `matchId` (TEXT NOT NULL, FOREIGN KEY), `team` (TEXT NOT NULL, 'A' 또는 'B'), `memberId` (TEXT NOT NULL), `position` (TEXT NOT NULL) 컬럼을 가져야 한다(SHALL).

#### Scenario: Match 저장 시 slots도 함께 저장
- **WHEN** teamA와 teamB를 포함한 Match를 저장할 때
- **THEN** `matches` 테이블에 매치 레코드가 생성되고, `match_slots` 테이블에 각 팀원 슬롯이 생성되어야 한다

#### Scenario: Match 조회 시 slots 복원
- **WHEN** Match를 findById로 조회할 때
- **THEN** match_slots에서 team 'A'와 'B'로 분류하여 teamA, teamB 배열로 복원되어야 한다

### Requirement: TursoMatchRepository는 IMatchRepository를 구현
`TursoMatchRepository`는 `IMatchRepository` 인터페이스의 `findAll()`, `findById(id)`, `save(match)` 메서드를 모두 구현해야 한다(SHALL).

#### Scenario: findAll로 전체 매치 조회
- **WHEN** findAll()을 호출할 때
- **THEN** 모든 매치가 teamA, teamB 슬롯을 포함하여 반환되어야 한다

#### Scenario: save로 새 매치 저장
- **WHEN** 존재하지 않는 id의 Match를 save할 때
- **THEN** 새 레코드가 생성되어야 한다

#### Scenario: save로 기존 매치 업데이트
- **WHEN** 이미 존재하는 id의 Match를 save할 때
- **THEN** 기존 레코드와 관련 slots가 업데이트되어야 한다

### Requirement: TursoMemberRepository는 IMemberRepository를 구현
`TursoMemberRepository`는 `IMemberRepository` 인터페이스의 `findAll()`, `findById(id)`, `save(member)`, `saveAll(members)`, `delete(id)` 메서드를 모두 구현해야 한다(SHALL).

#### Scenario: findAll로 전체 멤버 조회
- **WHEN** findAll()을 호출할 때
- **THEN** 모든 멤버가 subPositions 배열과 streak 객체를 포함하여 반환되어야 한다

#### Scenario: save로 새 멤버 저장
- **WHEN** 존재하지 않는 id의 Member를 save할 때
- **THEN** 새 레코드가 생성되어야 한다

#### Scenario: delete로 멤버 삭제
- **WHEN** delete(id)를 호출할 때
- **THEN** 해당 멤버가 DB에서 제거되어야 한다

#### Scenario: saveAll로 전체 멤버 일괄 저장
- **WHEN** saveAll(members)를 호출할 때
- **THEN** 기존 데이터를 모두 교체하여 전달받은 멤버 목록으로 저장되어야 한다
