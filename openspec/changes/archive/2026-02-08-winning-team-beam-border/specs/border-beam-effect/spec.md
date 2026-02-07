## ADDED Requirements

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

#### Scenario: 두께 및 속도 조절
- **WHEN** ShineBorder에 `borderWidth`, `duration` props가 전달된다
- **THEN** 테두리의 두께와 애니메이션 속도가 해당 값에 따라 조절되어야 한다
