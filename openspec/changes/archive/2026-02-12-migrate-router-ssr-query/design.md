## Context

현재 `src/router.tsx`에서 `@tanstack/react-router-with-query`의 `routerWithQueryClient`를 사용하여 TanStack Router와 React Query를 통합하고 있다. 이 패키지는 비공식적이며, 공식 후속 패키지 `@tanstack/react-router-ssr-query`가 `setupRouterSsrQueryIntegration` API를 제공한다.

현재 코드:
```ts
return routerWithQueryClient(
  createRouter({ routeTree, context: { queryClient }, ... }),
  queryClient,
);
```

새 API:
```ts
const router = createRouter({ routeTree, context: { queryClient }, ... });
setupRouterSsrQueryIntegration({ router, queryClient });
return router;
```

## Goals / Non-Goals

**Goals:**
- `@tanstack/react-router-with-query` → `@tanstack/react-router-ssr-query` 패키지 교체
- `routerWithQueryClient` → `setupRouterSsrQueryIntegration` API 전환
- SSR dehydration/hydration 동작 유지

**Non-Goals:**
- Query 옵션이나 라우트 loader 로직 변경
- React Query 버전 업그레이드
- 라우터 설정 변경 (scrollRestoration, defaultPreloadStaleTime 등)

## Decisions

1. **`setupRouterSsrQueryIntegration` 사용**: `routerWithQueryClient`가 라우터를 래핑하여 반환하는 방식에서, `setupRouterSsrQueryIntegration`이 라우터에 SSR 통합을 side-effect로 설정하는 방식으로 변경. 공식 문서 권장 패턴.

2. **`wrapQueryClient` 기본값 사용**: `setupRouterSsrQueryIntegration`은 기본적으로 `QueryClientProvider`를 자동 래핑한다. 현재 별도 Provider를 사용하지 않으므로 기본 동작을 그대로 사용.

## Risks / Trade-offs

- **[호환성]** 새 패키지 버전이 현재 `@tanstack/react-router` `^1.132.0`과 호환되는지 확인 필요 → 같은 TanStack 생태계이므로 호환 가능성 높음, 설치 시 peer dependency 확인
- **[동작 차이]** 래핑 방식에서 side-effect 방식으로 변경되므로 미세한 동작 차이 가능 → 기존 loader 동작 (ensureQueryData) 테스트로 확인
