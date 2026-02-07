## Context

현재 Match 타입은 `winner`가 필수이며 경기 결과가 확정된 후에만 저장된다. 매칭 과정(참가자 선택, 후보 생성, 후보 확정)의 모든 상태는 클라이언트 `useState`에만 존재하여, 페이지 이탈 시 전부 소실된다.

현재 구조:
- `Match`: `{ id, date, teamA, teamB, winner }` — winner 필수
- DB `matches` 테이블: `winner TEXT NOT NULL`
- `recordMatch`: 팀 구성 + winner를 한번에 받아 매치 생성 + MMR 반영

## Goals / Non-Goals

**Goals:**
- 매칭 확정(후보 선택) 시점에 매치를 서버에 저장하여 페이지 이탈 후에도 복원 가능
- 전적 페이지에서 in_progress 매치의 승자를 선택하여 결과 기록
- 기존 completed 매치 데이터와 호환 유지

**Non-Goals:**
- 참가자 선택 단계나 후보 생성 단계의 상태 저장 (확정 전 단계는 저장하지 않음)
- 동시에 여러 in_progress 매치를 관리하는 것 (한 번에 하나의 매치만 진행)

## Decisions

### 1. Match 타입에 status 필드 추가

`Match.status`: `'in_progress' | 'completed'`, `Match.winner`: `TeamSide | null`로 변경.

**대안: 별도 MatchSession 엔티티**
별도 테이블과 타입을 추가하면 기존 Match를 건드리지 않지만, 중복 데이터 구조(teamA, teamB)가 생기고 세션→매치 전환 로직이 필요해 복잡도가 높아진다. Match 자체에 상태를 추가하는 것이 데이터 모델이 단순하고 자연스럽다.

### 2. DB 마이그레이션: ALTER TABLE

기존 `matches` 테이블에 `status` 컬럼 추가 (`DEFAULT 'completed'`), `winner` 컬럼을 nullable로 변경.

`CREATE TABLE IF NOT EXISTS`로 초기화하는 현재 패턴상, `initDb`에서 ALTER TABLE을 시도하고 이미 존재하면 무시하는 방식으로 마이그레이션 처리.

### 3. 매치 생성/완료를 분리된 서비스 메서드로

- `createMatch(teamA, teamB)` → in_progress 매치 생성, 반환
- `completeMatch(id, winner)` → winner 설정 + status를 completed로 + MMR 반영
- `cancelMatch(id)` → in_progress 매치 삭제

기존 `recordMatch`는 `createMatch` + `completeMatch`의 조합이므로 제거하거나 내부적으로 위임.

### 4. 전적 페이지에서 결과 입력, 매칭 페이지에서 결과 입력 UI 제거

매칭 페이지의 `ResultInput` 다이얼로그 제거. 확정 시 `createMatch` 호출 후 전적 페이지로 navigate.

전적 페이지에서 in_progress 매치를 상단에 별도로 표시하며 "팀 A 승리" / "팀 B 승리" 버튼과 "취소" 버튼 제공.

### 5. getAll에서 status 기반 필터링

`getAll`은 모든 매치를 반환하되, 클라이언트에서 status별로 분리하여 표시. in_progress 매치는 전적 목록 상단에 별도 섹션으로 노출.

## Risks / Trade-offs

**[Risk] 기존 데이터 호환** → 마이그레이션 시 기존 매치에 `status = 'completed'` 기본값 적용. winner가 이미 있으므로 데이터 손실 없음.

**[Risk] winner nullable 변경으로 타입 안전성 저하** → completed 매치에서 winner를 사용하는 모든 곳에서 null 체크가 필요해짐. 타입 가드 또는 별도 타입(`CompletedMatch`)으로 대응 가능하나, 현재 코드베이스 규모에서는 간단한 null 체크로 충분.

**[Risk] in_progress 매치가 방치될 가능성** → 취소 버튼을 명확히 제공하여 운영자가 직접 정리. 자동 만료는 현재 범위 밖.

## Migration Plan

1. `initDb`에서 ALTER TABLE로 `status` 컬럼 추가 (DEFAULT 'completed')
2. `winner` 컬럼은 Turso(SQLite) 특성상 ALTER로 NOT NULL 제거가 불가하므로, 기존 컬럼 유지하되 코드에서 빈 문자열로 저장하고 조회 시 null로 변환하는 방식 적용
3. 배포 즉시 적용, 롤백 시 status 컬럼 무시하면 되므로 안전
