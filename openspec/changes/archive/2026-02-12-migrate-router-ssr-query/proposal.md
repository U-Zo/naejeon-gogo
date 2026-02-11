## Why

`@tanstack/react-router-with-query`는 비공식적이고 문서화되지 않은 패키지로, 공식 후속 패키지인 `@tanstack/react-router-ssr-query`로 대체되었다. 새 패키지는 `setupRouterSsrQueryIntegration` API를 제공하며, 공식 문서에서 권장하는 방식이다.

## What Changes

- `@tanstack/react-router-with-query` 패키지 제거
- `@tanstack/react-router-ssr-query` 패키지 설치
- `src/router.tsx`에서 `routerWithQueryClient` 래퍼를 `setupRouterSsrQueryIntegration` 호출로 교체

## Capabilities

### New Capabilities

(없음 - 기능 변경 없이 패키지 마이그레이션만 수행)

### Modified Capabilities

(없음 - 기존 SSR dehydration/hydration 동작은 동일하게 유지)

## Impact

- **Dependencies**: `@tanstack/react-router-with-query` 제거, `@tanstack/react-router-ssr-query` 추가
- **Code**: `src/router.tsx` 1개 파일만 변경
- **Behavior**: SSR dehydration/hydration, 라우트 loader의 queryClient 접근 등 기존 동작 동일
