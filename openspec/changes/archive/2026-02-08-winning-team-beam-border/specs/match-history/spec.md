## MODIFIED Requirements

### Requirement: 진행 중 매치 표시
시스템은 전적 페이지에서 in_progress 상태의 매치를 완료된 경기와 구분하여 표시해야 한다.

#### Scenario: in_progress 매치 상단 표시
- **WHEN** 운영자가 전적 탭을 열고 in_progress 매치가 존재한다
- **THEN** 시스템은 in_progress 매치를 전적 목록 상단에 별도 섹션으로 표시하며, 팀 구성(멤버, 포지션)과 팀별 MMR을 보여준다

#### Scenario: in_progress 매치 없음
- **WHEN** 운영자가 전적 탭을 열고 in_progress 매치가 없다
- **THEN** 시스템은 기존과 동일하게 완료된 경기 목록만 표시한다

#### Scenario: in_progress 매치 ShineBorder 강조
- **WHEN** in_progress 매치 카드가 렌더링된다
- **THEN** 시스템은 해당 카드에 골드 계열 ShineBorder 애니메이션을 표시하여 진행 중임을 시각적으로 강조해야 한다

### Requirement: 승리 팀 시각적 강조
완료된 매치에서 승리 팀을 배경색으로 시각적으로 구분해야 한다.

#### Scenario: 승리 팀 배경색 표시
- **WHEN** 완료된 매치의 승리 팀 컬럼이 렌더링된다
- **THEN** 시스템은 팀 A 승리 시 블루 계열 반투명 배경색, 팀 B 승리 시 레드 계열 반투명 배경색을 적용하여 승리 팀을 강조해야 한다

#### Scenario: 패배 팀 표시
- **WHEN** 완료된 매치의 패배 팀 컬럼이 렌더링된다
- **THEN** 시스템은 패배 팀 컬럼에 배경색을 적용하지 않아야 한다
