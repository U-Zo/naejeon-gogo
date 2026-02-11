## 1. 패키지 교체

- [x] 1.1 `@tanstack/react-router-with-query` 제거
- [x] 1.2 `@tanstack/react-router-ssr-query` 설치

## 2. 코드 변경

- [x] 2.1 `src/router.tsx`에서 import를 `routerWithQueryClient` → `setupRouterSsrQueryIntegration`으로 변경
- [x] 2.2 `routerWithQueryClient` 래퍼 호출을 `createRouter` + `setupRouterSsrQueryIntegration` side-effect 호출로 변경

## 3. 검증

- [x] 3.1 빌드 성공 확인
- [ ] 3.2 개발 서버에서 라우트 loader (ensureQueryData) 정상 동작 확인
