## 1. ShineBorder 컴포넌트 수정

- [x] 1.1 `ShineBorder.tsx`에 `delay` prop 추가 (animationDelay로 구현, 기본값 0)

## 2. 멤버 페이지 전환

- [x] 2.1 `MembersPage.tsx`의 `getStreakBeams`를 `getStreakShines`로 변경 (ShineBorder props 반환)
- [x] 2.2 `MemberCard`에서 BorderBeam → ShineBorder로 교체

## 3. 매칭 페이지 전환

- [x] 3.1 `MatchmakingPage.tsx`의 `getStreakBeams`를 `getStreakShines`로 변경 (ShineBorder props 반환)
- [x] 3.2 `memberRow`에서 BorderBeam → ShineBorder로 교체

## 4. BorderBeam 제거

- [x] 4.1 `BorderBeam.tsx`, `BorderBeam.css.ts` 삭제
- [x] 4.2 `motion` 패키지 제거

## 5. 검증

- [x] 5.1 빌드 성공 확인
