## ADDED Requirements

### Requirement: 진행 중 매치 표시
시스템은 전적 페이지에서 in_progress 상태의 매치를 완료된 경기와 구분하여 표시해야 한다.

#### Scenario: in_progress 매치 상단 표시
- **WHEN** 운영자가 전적 탭을 열고 in_progress 매치가 존재한다
- **THEN** 시스템은 in_progress 매치를 전적 목록 상단에 별도 섹션으로 표시하며, 팀 구성(멤버, 포지션)과 팀별 MMR을 보여준다

#### Scenario: in_progress 매치 없음
- **WHEN** 운영자가 전적 탭을 열고 in_progress 매치가 없다
- **THEN** 시스템은 기존과 동일하게 완료된 경기 목록만 표시한다

### Requirement: 진행 중 매치 결과 입력
시스템은 전적 페이지에서 in_progress 매치의 승자를 선택할 수 있어야 한다.

#### Scenario: 승자 선택
- **WHEN** 운영자가 in_progress 매치에서 "팀 A 승리" 또는 "팀 B 승리" 버튼을 누른다
- **THEN** 시스템은 해당 매치의 status를 completed로 변경하고, winner를 설정하며, 승리 팀 MMR +25 / 패배 팀 MMR -25를 반영한다

### Requirement: 진행 중 매치 취소
시스템은 전적 페이지에서 in_progress 매치를 취소(삭제)할 수 있어야 한다.

#### Scenario: 매치 취소
- **WHEN** 운영자가 in_progress 매치에서 취소 버튼을 누른다
- **THEN** 시스템은 해당 매치를 삭제하고, 전적 목록에서 제거한다

## MODIFIED Requirements

### Requirement: 경기 결과 기록
시스템은 확정된 매칭의 결과(승/패)를 기록할 수 있어야 한다.

#### Scenario: 승리 팀 선택
- **WHEN** 운영자가 전적 페이지에서 in_progress 매치의 승리 팀을 선택한다
- **THEN** 시스템은 경기 결과를 저장하고, 승리 팀 멤버의 MMR을 +25, 패배 팀 멤버의 MMR을 -25 조정한다

#### Scenario: 결과 기록 시 날짜 자동 설정
- **WHEN** 매칭이 확정되어 in_progress 매치가 생성된다
- **THEN** 시스템은 현재 날짜/시간을 경기 일시로 자동 설정한다

### Requirement: 전적 목록 조회
시스템은 과거 경기 기록을 목록으로 표시해야 한다.

#### Scenario: 전적 목록 표시
- **WHEN** 운영자가 전적 탭을 연다
- **THEN** 시스템은 completed 매치를 최근 경기부터 날짜, 팀A vs 팀B, 승리 팀 순으로 목록 표시하고, in_progress 매치는 상단에 별도 섹션으로 표시한다

#### Scenario: 경기 상세 조회
- **WHEN** 운영자가 전적 목록에서 특정 completed 경기를 선택한다
- **THEN** 시스템은 해당 경기의 팀 구성(멤버, 포지션), 승패, MMR 변동을 상세히 표시한다
