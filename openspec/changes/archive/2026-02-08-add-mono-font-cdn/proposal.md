## Why

현재 모노스페이스 폰트로 JetBrains Mono를 사용하고 있지만, CDN import 없이 `font-family` 선언만 존재한다. 사용자 기기에 JetBrains Mono가 설치되어 있지 않으면 브라우저 기본 `monospace` 폰트로 fallback되어 기기마다 다른 폰트가 렌더링된다. body 폰트인 Pretendard는 이미 CDN에서 로드하고 있으므로, mono 폰트도 동일한 방식으로 CDN import를 추가하여 모든 기기에서 일관된 타이포그래피를 보장해야 한다.

## What Changes

- `__root.tsx`의 `links` 배열에 JetBrains Mono CDN stylesheet link 추가 (Google Fonts 또는 jsdelivr 활용)
- 기존 `theme.css.ts`의 `font.mono` 값은 이미 `'JetBrains Mono', monospace`로 되어 있으므로 변경 불필요
- 모노 폰트를 사용하는 모든 컴포넌트(`MatchmakingPage`, `MembersPage`, `common.css.ts`)에서 자동으로 적용됨

## Capabilities

### New Capabilities

- `mono-font-cdn`: 모노스페이스 폰트(JetBrains Mono)를 CDN에서 로드하여 모든 기기에서 동일한 폰트를 보장하는 기능

### Modified Capabilities

(없음 — 기존 스펙의 요구사항 변경 없음)

## Impact

- **코드**: `src/routes/__root.tsx` — links 배열에 CDN link 1개 추가
- **의존성**: 외부 CDN(Google Fonts 또는 jsdelivr)에 대한 네트워크 의존성 추가
- **성능**: 추가 CSS 파일 로드 (~30KB gzipped). `font-display: swap` 적용으로 FOUT 최소화
- **호환성**: 기존 `font-family` 선언과 완전 호환. fallback 체인(`monospace`) 유지
