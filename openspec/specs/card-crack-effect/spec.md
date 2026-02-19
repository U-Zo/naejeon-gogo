## ADDED Requirements

### Requirement: 연패 단계별 금 간 효과 표시
연패(lose streak) 2회 이상인 멤버의 카드에 금 간(crack) 시각 효과를 표시하여야 한다(SHALL). 금 효과는 카드 360도 테두리에서 가운데를 향해 뻗어나가는 번개 모양이며, 연패 횟수에 따라 3단계로 구분된다.

#### Scenario: 2연패 시 1단계 금 효과
- **WHEN** 멤버의 lose streak count가 2일 때
- **THEN** 카드에 level 1 금 효과가 표시되어야 한다 (메인 금 5갈래, 테두리 근처 짧은 금)

#### Scenario: 3연패 시 2단계 금 효과
- **WHEN** 멤버의 lose streak count가 3일 때
- **THEN** 카드에 level 2 금 효과가 표시되어야 한다 (메인 금 8갈래, 카드 중간까지 침투)

#### Scenario: 4연패 이상 시 3단계 금 효과
- **WHEN** 멤버의 lose streak count가 4 이상일 때
- **THEN** 카드에 level 3 금 효과가 표시되어야 한다 (메인 금 11갈래, 가운데까지 완전 관통)

### Requirement: 금 효과 오버레이 비간섭성
금 효과 오버레이는 카드의 클릭, 호버 등 기존 인터랙션을 방해하지 않아야 한다(MUST).

#### Scenario: 금 효과가 있는 카드 클릭
- **WHEN** 금 효과가 표시된 카드를 클릭할 때
- **THEN** 기존 클릭 동작(멤버 편집 등)이 정상적으로 실행되어야 한다

### Requirement: 연승과 연패 효과 상호 배타
연승 효과(ShineBorder)와 연패 효과(CrackOverlay)는 동시에 표시되지 않아야 한다(MUST). streak type이 'win'이면 ShineBorder만, 'lose'이면 CrackOverlay만 표시된다.

#### Scenario: 연승 중인 멤버 카드
- **WHEN** 멤버의 streak type이 'win'이고 count가 2 이상일 때
- **THEN** ShineBorder 효과만 표시되고 CrackOverlay는 표시되지 않아야 한다

#### Scenario: 연패 중인 멤버 카드
- **WHEN** 멤버의 streak type이 'lose'이고 count가 2 이상일 때
- **THEN** CrackOverlay 효과만 표시되고 ShineBorder는 표시되지 않아야 한다

### Requirement: 멤버 목록과 매치메이킹 선택 화면 동일 적용
금 효과는 MemberCard(멤버 목록 페이지)와 SelectPhase(매치메이킹 선택 화면) 양쪽에서 동일하게 표시되어야 한다(SHALL).

#### Scenario: 멤버 목록 페이지에서 연패 카드 확인
- **WHEN** 멤버 목록 페이지에서 연패 2회 이상인 멤버 카드를 볼 때
- **THEN** 해당 카드에 연패 단계에 맞는 금 효과가 표시되어야 한다

#### Scenario: 매치메이킹 선택 화면에서 연패 카드 확인
- **WHEN** 매치메이킹 선택 화면에서 연패 2회 이상인 멤버 카드를 볼 때
- **THEN** 해당 카드에 연패 단계에 맞는 금 효과가 표시되어야 한다

### Requirement: 연패 1회 이하 시 금 효과 없음
streak이 없거나 lose streak count가 1 이하인 경우 금 효과를 표시하지 않아야 한다(MUST).

#### Scenario: streak 없는 멤버
- **WHEN** 멤버의 streak이 null일 때
- **THEN** 금 효과가 표시되지 않아야 한다

#### Scenario: 1연패 멤버
- **WHEN** 멤버의 lose streak count가 1일 때
- **THEN** 금 효과가 표시되지 않아야 한다
