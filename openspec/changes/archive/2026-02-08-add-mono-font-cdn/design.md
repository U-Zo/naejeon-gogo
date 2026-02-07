## Context

현재 프로젝트는 `src/routes/__root.tsx`에서 Pretendard 폰트를 jsdelivr CDN으로 로드하고 있다. 모노스페이스 폰트인 JetBrains Mono는 `theme.css.ts`에서 `font-family`로 선언만 되어 있고, CDN import가 없어 로컬에 설치되지 않은 기기에서는 브라우저 기본 monospace 폰트로 fallback된다.

기존 폰트 로딩 패턴:
```tsx
// __root.tsx links 배열
{ rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css' }
```

모노 폰트 사용처: `MatchmakingPage.css.ts`, `MembersPage.css.ts`, `common.css.ts`에서 `vars.font.mono` 참조.

## Goals / Non-Goals

**Goals:**
- 모든 기기에서 JetBrains Mono가 동일하게 렌더링되도록 CDN import 추가
- 기존 Pretendard CDN 로딩과 동일한 패턴 유지
- `font-display: swap`을 지원하여 폰트 로딩 중 텍스트가 보이도록 보장

**Non-Goals:**
- `theme.css.ts`의 `font.mono` 값 변경 (이미 올바르게 설정됨)
- 폰트 weight 최적화 (전체 weight 포함 — 현재 사용량이 적어 서브셋 불필요)
- 셀프호스팅 (CDN 사용으로 충분)

## Decisions

### CDN 선택: Google Fonts

**선택**: Google Fonts (`fonts.googleapis.com`)
**대안 검토**:
- **jsdelivr (npm)**: JetBrains Mono npm 패키지를 jsdelivr로 로드. 가능하지만 Google Fonts 대비 캐시 히트율이 낮음.
- **Bunny Fonts**: GDPR 친화적이지만 한국 사용자 기준 CDN 엣지 서버가 적음.
- **Google Fonts**: 전 세계적으로 가장 높은 캐시 히트율, 한국 포함 아시아 CDN 엣지 우수, `font-display=swap` 파라미터 기본 지원.

**근거**: Google Fonts는 사용자 브라우저에 이미 캐시되어 있을 가능성이 높고, `display=swap` 파라미터로 FOUT를 간단히 제어할 수 있다.

### 폰트 Weight: 400, 700

**선택**: Regular(400)와 Bold(700)만 로드
**근거**: 코드에서 `fontWeight: 700`을 사용하는 곳이 있고, 나머지는 기본(400). 불필요한 weight를 제외하여 로딩 크기를 최소화.

### 로딩 위치: `__root.tsx` links 배열

**선택**: 기존 Pretendard와 동일하게 `createRootRouteWithContext`의 `links` 배열에 추가
**근거**: 일관된 패턴 유지. TanStack Router의 head management를 활용하여 `<head>`에 자동 삽입.

## Risks / Trade-offs

- **[CDN 장애]** → Google Fonts CDN 장애 시 `monospace` fallback으로 자연스럽게 동작. 기존과 동일한 수준의 graceful degradation.
- **[추가 네트워크 요청]** → 1개의 CSS 파일 + woff2 폰트 파일 추가 로드. Google Fonts는 `font-display: swap`과 효율적 서브셋 제공으로 성능 영향 최소.
- **[FOUT(Flash of Unstyled Text)]** → `display=swap` 파라미터로 폰트 로딩 중에도 텍스트가 보이도록 처리. 모노 폰트는 UI의 부수적 요소이므로 잠깐의 FOUT는 허용 가능.
