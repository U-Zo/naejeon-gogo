## Why

현재 시스템은 모든 사용자가 멤버 등록, 수정, 삭제를 자유롭게 할 수 있다. 관리자만 멤버 정보를 수정/삭제할 수 있도록 권한을 제한하여 실수로 인한 데이터 변경을 방지해야 한다.

## What Changes

- 관리자 비밀번호 입력을 통한 로그인 기능 추가
- React Context API로 관리자 인증 상태를 전역 관리
- 관리자로 로그인하지 않은 경우 멤버 수정/삭제 버튼 숨김
- 멤버 등록은 모든 사용자가 가능, 수정/삭제는 관리자만 가능

## Capabilities

### New Capabilities
- `admin-auth`: 관리자 비밀번호 인증 및 권한 기반 UI 접근 제어

### Modified Capabilities
- `member-management`: 멤버 수정/삭제 기능에 관리자 인증 조건 추가

## Impact

- `src/client/pages/members/MembersPage.tsx`: 수정/삭제 버튼에 관리자 인증 조건 분기 추가
- `src/client/domains/`: admin 관련 context 및 hook 추가
- `src/client/components/`: 관리자 로그인 UI 컴포넌트 추가
- 서버 측 변경 없음 (클라이언트 전용 인증)
