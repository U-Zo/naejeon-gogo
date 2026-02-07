## 1. 서버 비밀번호 검증

- [x] 1.1 `src/server/auth/auth.controller.ts` 생성: `verifyAdminPassword` 서버 함수 구현 (createServerFn, ADMIN_PASSWORD 환경변수 비교)
- [x] 1.2 `.env` 파일에 `ADMIN_PASSWORD` 환경변수 추가 (기본값 설정)

## 2. 클라이언트 인증 상태 관리

- [x] 2.1 `src/client/domains/auth/AuthContext.tsx` 생성: AuthContext, AuthProvider 구현 (isAdmin 상태, login/logout 함수)
- [x] 2.2 `src/client/domains/auth/useAuth.ts` 생성: useAuth 커스텀 hook 구현
- [x] 2.3 `src/client/domains/auth/index.ts` 생성: 모듈 exports
- [x] 2.4 `src/routes/__root.tsx`에서 AuthProvider로 앱 감싸기

## 3. 관리자 로그인 UI

- [x] 3.1 `src/client/components/AdminAuth.tsx` 생성: 잠금/잠금해제 아이콘 토글 버튼
- [x] 3.2 `src/client/components/AdminAuth.tsx`에 비밀번호 입력 모달 포함 (비밀번호 필드, 로그인 버튼, 에러 메시지)
- [x] 3.3 `src/client/components/Layout.tsx`에 AdminLoginButton 추가

## 4. 멤버 수정/삭제 권한 분기

- [x] 4.1 `src/client/pages/members/MembersPage.tsx`의 MemberCard에서 삭제 버튼을 isAdmin 조건부 렌더링
- [x] 4.2 MemberCard의 onClick(수정) 핸들러를 isAdmin 조건부로 변경 (비관리자는 카드 클릭 시 편집 안 됨)
