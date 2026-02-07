## Why

현재 멤버 수정이 관리자 전용으로 제한되어 있어, 일반 사용자가 이름이나 포지션을 변경하려면 관리자 로그인이 필요하다. MMR은 경기 결과에 직접 영향을 주므로 관리자만 수정 가능해야 하지만, 이름/포지션 같은 기본 정보는 누구나 수정할 수 있어야 편의성이 높아진다.

## What Changes

- 비관리자도 멤버 카드를 클릭하여 수정 폼에 접근 가능
- 비관리자 수정 폼에서는 MMR 필드를 비활성화(읽기 전용)
- 관리자 수정 폼에서는 모든 필드(MMR 포함) 수정 가능
- 삭제 권한은 변경 없음 (관리자 전용 유지)

## Capabilities

### New Capabilities

(없음)

### Modified Capabilities

- `member-management`: 멤버 수정 권한을 세분화 — 기본 정보(이름, 포지션, 임시 여부)는 누구나, MMR은 관리자만 수정 가능
- `admin-auth`: 관리자 전용 기능 범위를 멤버 삭제 + MMR 수정으로 축소

## Impact

- `src/client/pages/members/MembersPage.tsx`: MemberCard 클릭 핸들러 변경, MemberForm에서 MMR 필드 조건부 비활성화
