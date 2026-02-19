## Requirements

### Requirement: ShineBorder 컴포넌트
시스템은 컨테이너의 테두리에 빛이 회전하는 애니메이션 효과를 제공하는 ShineBorder 컴포넌트를 제공해야 한다. Magic UI의 ShineBorder를 vanilla-extract 기반으로 포팅한다.

#### Scenario: 기본 렌더링
- **WHEN** ShineBorder 컴포넌트가 relative position을 가진 컨테이너 안에 렌더링된다
- **THEN** radial-gradient 기반의 빛이 테두리를 따라 무한히 회전하는 CSS 애니메이션이 표시되어야 한다

#### Scenario: 색상 커스터마이징
- **WHEN** ShineBorder에 `shineColor` prop이 전달된다 (단일 색상 또는 색상 배열)
- **THEN** 테두리의 빛 그라데이션이 해당 색상으로 렌더링되어야 한다

#### Scenario: 포인터 이벤트 투과
- **WHEN** ShineBorder가 렌더링된 상태에서 사용자가 컨테이너 내부를 클릭한다
- **THEN** ShineBorder는 `pointer-events: none`으로 설정되어 클릭 이벤트를 차단하지 않아야 한다

#### Scenario: 두께, 속도, 지연 조절
- **WHEN** ShineBorder에 `borderWidth`, `duration`, `delay` props가 전달된다
- **THEN** 테두리의 두께, 애니메이션 속도, 애니메이션 시작 지연이 해당 값에 따라 조절되어야 한다

### Requirement: 연승 멤버에 ShineBorder 효과 적용
멤버 관리 페이지의 MemberCard와 매칭 페이지의 memberRow는 해당 멤버가 연승 중(streak.type === 'win' && streak.count >= 2)일 때 ShineBorder 효과를 표시해야 한다. 연승이 아니거나 연승 횟수가 2 미만인 경우 효과를 표시하지 않아야 한다.

#### Scenario: 연승 2회 이상인 멤버
- **WHEN** 멤버의 streak이 `{ type: 'win', count: N }`이고 N >= 2이다
- **THEN** 해당 멤버 카드/행에 ShineBorder 효과가 렌더링되어야 한다

#### Scenario: 연승이 아닌 멤버
- **WHEN** 멤버의 streak이 null이거나 type이 'lose'이거나 count가 2 미만이다
- **THEN** 해당 멤버 카드/행에 ShineBorder 효과가 렌더링되지 않아야 한다

### Requirement: 연승 단계별 샤인 개수 증가
ShineBorder 효과는 연승 횟수에 따라 샤인 개수가 단계적으로 증가해야 한다.

#### Scenario: 2연승
- **WHEN** 멤버의 연승 횟수가 2이다
- **THEN** ShineBorder가 1개 렌더링되어야 한다

#### Scenario: 3연승
- **WHEN** 멤버의 연승 횟수가 3이다
- **THEN** ShineBorder가 2개 렌더링되어야 한다

#### Scenario: 4연승 이상
- **WHEN** 멤버의 연승 횟수가 4 이상이다
- **THEN** ShineBorder가 3개 렌더링되어야 한다

### Requirement: 샤인 등간격 유지
동일 단계의 샤인들은 같은 속도(duration)로 애니메이션되며 균등한 간격을 유지해야 한다.

#### Scenario: 다중 샤인 간격
- **WHEN** N개의 샤인이 duration D로 렌더링된다
- **THEN** 각 샤인의 delay는 `D / N * index`로 설정되어 샤인들이 테두리 위에서 균등한 간격으로 분포해야 한다

### Requirement: 단계별 색상 변화
연승 횟수가 높을수록 색상이 갈색에서 무지개 다색으로 변화해야 한다.

#### Scenario: 2연승 색상
- **WHEN** 멤버의 연승 횟수가 2이다
- **THEN** 샤인 색상은 갈색(brown) 단색 계열이어야 한다

#### Scenario: 3연승 색상
- **WHEN** 멤버의 연승 횟수가 3이다
- **THEN** 샤인 색상은 오렌지-레드 그라데이션이어야 한다

#### Scenario: 4연승 이상 색상
- **WHEN** 멤버의 연승 횟수가 4 이상이다
- **THEN** 샤인 색상은 무지개 다색 (red/magenta, cyan/green, gold/orange) 그라데이션이어야 한다

### Requirement: ShineBorder가 카드 인터랙션을 방해하지 않음
ShineBorder 효과는 멤버 카드/행의 기존 인터랙션(클릭)을 방해하지 않아야 한다.

#### Scenario: 연승 카드 클릭
- **WHEN** ShineBorder가 적용된 멤버 카드/행을 사용자가 클릭한다
- **THEN** 카드/행의 onClick 핸들러가 정상적으로 동작해야 한다
