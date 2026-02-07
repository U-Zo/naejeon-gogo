## 1. 데이터 모델 및 DB 마이그레이션

- [x] 1.1 Match 타입에 `status: 'in_progress' | 'completed'` 추가, `winner`를 `TeamSide | null`로 변경 (server + client 양쪽)
- [x] 1.2 `initDb`에서 ALTER TABLE로 matches 테이블에 `status` 컬럼 추가 (DEFAULT 'completed')
- [x] 1.3 TursoMatchRepository의 조회/저장 로직에서 status 필드 처리, winner nullable 처리

## 2. 서버 서비스 및 API

- [x] 2.1 MatchService에 `createMatch(teamA, teamB)` 메서드 추가 (in_progress 매치 생성)
- [x] 2.2 MatchService에 `completeMatch(id, winner)` 메서드 추가 (status를 completed로 변경 + MMR delta 반환)
- [x] 2.3 MatchService에 `cancelMatch(id)` 메서드 추가 (in_progress 매치 삭제)
- [x] 2.4 match.controller에 createMatch, completeMatch, cancelMatch 서버 함수 추가

## 3. 매칭 페이지 변경

- [x] 3.1 매칭 확정 시 createMatch API 호출 후 전적 페이지로 navigate
- [x] 3.2 ResultInput 컴포넌트 및 관련 상태(showResultInput) 제거

## 4. 전적 페이지 변경

- [x] 4.1 전적 페이지에서 in_progress 매치를 상단에 별도 섹션으로 표시 (팀 구성, 포지션, MMR)
- [x] 4.2 in_progress 매치에 "팀 A 승리" / "팀 B 승리" 버튼 추가, completeMatch API 연동
- [x] 4.3 in_progress 매치에 취소 버튼 추가, cancelMatch API 연동
