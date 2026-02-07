## ADDED Requirements

### Requirement: 멤버 데이터 저장
시스템은 멤버 데이터를 JSON 파일로 서버 사이드에 저장해야 한다.

#### Scenario: 멤버 등록 시 저장
- **WHEN** 새 멤버가 등록된다
- **THEN** 시스템은 `data/members.json` 파일에 멤버 데이터를 저장한다

#### Scenario: 멤버 수정 시 저장
- **WHEN** 멤버 정보가 수정된다
- **THEN** 시스템은 `data/members.json` 파일을 업데이트한다

### Requirement: 경기 데이터 저장
시스템은 경기 기록을 JSON 파일로 서버 사이드에 저장해야 한다.

#### Scenario: 경기 결과 저장
- **WHEN** 경기 결과가 기록된다
- **THEN** 시스템은 `data/matches.json` 파일에 경기 데이터를 추가한다

### Requirement: 데이터 로드
시스템은 앱 시작 시 JSON 파일에서 데이터를 로드해야 한다.

#### Scenario: 정상 로드
- **WHEN** 앱이 시작되고 JSON 파일이 존재한다
- **THEN** 시스템은 파일에서 멤버와 경기 데이터를 로드한다

#### Scenario: 파일 미존재 시 초기화
- **WHEN** 앱이 시작되고 JSON 파일이 존재하지 않는다
- **THEN** 시스템은 빈 배열로 초기 JSON 파일을 생성한다

### Requirement: 데이터 무결성
시스템은 저장 시 데이터 무결성을 보장해야 한다.

#### Scenario: 원자적 쓰기
- **WHEN** 데이터가 저장된다
- **THEN** 시스템은 임시 파일에 먼저 쓰고 이후 원본 파일을 교체하여 쓰기 중 오류로 인한 데이터 손상을 방지한다
