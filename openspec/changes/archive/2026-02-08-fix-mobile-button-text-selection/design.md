## Context

프로젝트는 Vanilla Extract(CSS-in-TS)를 사용하며, `src/client/styles/global.css.ts`에 전역 `button` 스타일 리셋이 존재한다. 현재 `userSelect` 속성은 프로젝트 어디에도 사용되지 않고 있다.

## Goals / Non-Goals

**Goals:**
- 모든 버튼에서 더블탭 시 텍스트 선택을 방지한다

**Non-Goals:**
- 버튼 외 일반 텍스트 영역의 선택 동작을 변경하지 않는다
- 개별 컴포넌트별 스타일을 수정하지 않는다

## Decisions

### 전역 button 리셋에 `userSelect: 'none'` 추가

**선택**: `global.css.ts`의 `globalStyle('button', { ... })`에 `userSelect: 'none'` 속성을 추가한다.

**근거**: 모든 버튼이 이 전역 리셋을 상속하므로 한 곳에서 일괄 적용된다. `button` 요소에서 텍스트 선택이 필요한 경우는 없다.

**대안 검토**:
- `common.css.ts`의 개별 버튼 variant에 추가 → 중복 코드, 누락 가능성
- JavaScript `preventDefault` → 불필요한 복잡성

## Risks / Trade-offs

- [리스크 없음] → `button` 요소의 텍스트 선택은 정상적인 사용 시나리오에 해당하지 않음
