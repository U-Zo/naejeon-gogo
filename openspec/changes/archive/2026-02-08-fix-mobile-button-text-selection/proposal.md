## Why

모바일 환경에서 버튼 요소를 빠르게 연속 터치(더블탭)하면 브라우저가 텍스트 선택 모드로 진입하여 버튼 내 글자가 선택된다. 이는 모바일 UX를 저해하는 문제이다.

## What Changes

- 전역 `button` 스타일 리셋에 `userSelect: 'none'`을 추가하여 모든 버튼 요소에서 텍스트 선택을 방지

## Capabilities

### New Capabilities

(없음)

### Modified Capabilities

(없음 - 구현 수준의 CSS 수정이며 spec 수준의 요구사항 변경이 아님)

## Impact

- `src/client/styles/global.css.ts` - 전역 `button` 스타일 리셋에 속성 1줄 추가
