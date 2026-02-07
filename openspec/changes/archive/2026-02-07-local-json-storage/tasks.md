## 1. JSON Repository 구현

- [ ] 1.1 `src/server/member/member.repository.json.ts` — IMemberRepository의 JSON 파일 구현체 생성
- [ ] 1.2 `src/server/match/match.repository.json.ts` — IMatchRepository의 JSON 파일 구현체 생성

## 2. Repository 팩토리

- [ ] 2.1 `src/server/repository.ts` — TURSO_DATABASE_URL 유무에 따라 Turso/JSON repository를 반환하는 팩토리 함수 생성
- [ ] 2.2 `match.controller.ts` — Turso 직접 import 대신 팩토리 함수 사용
- [ ] 2.3 `member.controller.ts` — Turso 직접 import 대신 팩토리 함수 사용

## 3. 정리

- [ ] 3.1 `.gitignore`에 `data/` 추가
- [ ] 3.2 `src/server/db.ts` — TURSO_DATABASE_URL 없을 때 에러 대신 조용히 스킵하도록 변경
