## Why

매칭 시작 후 페이지를 벗어나거나 브라우저를 닫으면 선택한 참가자, 생성된 후보 조합 등 모든 매칭 상태가 사라진다. 실제 내전 운영 중 카톡 확인, 다른 탭 이동 등으로 페이지를 벗어나는 경우가 빈번하며, 그때마다 10명을 다시 선택하고 매칭을 다시 돌려야 한다.

## What Changes

- Match에 `status` 필드 추가 (`in_progress` | `completed`), `winner`를 optional로 변경
- 매칭 후보 확정 시 `in_progress` 상태의 매치를 서버에 생성 (팀 구성만 저장, 승패 미정)
- 매칭 페이지에서 확정 후 전적 페이지로 이동
- 전적 페이지에서 `in_progress` 매치를 상단에 표시하고, 승자 선택 버튼을 제공
- 승자 선택 시 `completed`로 전환하며 MMR 반영
- `in_progress` 매치 삭제(취소) 기능 제공

## Capabilities

### New Capabilities

(없음)

### Modified Capabilities
- `matchmaking`: 매칭 확정 시 in_progress 매치 생성 후 전적 페이지로 이동, 기존 결과 입력 다이얼로그 제거
- `match-history`: Match 타입에 status 필드 추가, winner optional 변경, in_progress 매치를 상단에 별도 표시하며 승자 선택/취소 UI 제공

## Impact

- **서버**: Match 타입 변경, match.service에 in_progress 매치 생성/완료/삭제 로직 추가
- **DB**: matches 테이블에 status 컬럼 추가, winner 컬럼 nullable로 변경
- **클라이언트**: MatchmakingPage에서 결과 입력 UI 제거, 전적 페이지에서 in_progress 매치의 승자 선택 UI 추가
