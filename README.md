# Naejeon Gogo - LoL 내전 밸런스 매칭

> MMR과 포지션을 고려한 공정한 5v5 자동 팀 매칭 웹 앱

<!-- 메인 스크린샷 또는 배너 이미지 -->
<!-- ![WAR 스크린샷](./docs/screenshot.png) -->

## 프로젝트 소개

LoL 내전을 진행할 때마다 수동으로 팀을 나누면 밸런스가 맞지 않고 시간이 오래 걸립니다. 내전고고는 멤버의 실력(MMR)과 포지션을 고려해 자동으로 균형 잡힌 5v5 팀을 매칭하고, 내전 전적을 누적 관리하여 점점 더 정확한 밸런스 매칭을 제공합니다.

## 주요 기능

### 멤버 관리
- 고정 멤버 등록/수정, 임시 참가자 추가
- 포지션 관리: 주 포지션 1개(필수) + 부 포지션 (top / jungle / mid / adc / support)
- 멤버별 MMR 관리 (초기 1000, 관리자만 수동 조정 가능)
- 개인 전적 조회 (총 승수, 패수, 승률, 현재 MMR)
- 멤버 삭제는 관리자만 가능 (기존 전적은 보존)

### 관리자 인증
- 비밀번호 입력으로 관리자 모드 활성화
- 관리자 전용 기능: 멤버 삭제, MMR 수동 조정
- 헤더의 잠금/해제 아이콘으로 로그인/로그아웃

### 자동 매칭
- 멤버 풀에서 10명 선택 → MMR + 포지션 밸런스 기반 5v5 팀 자동 구성
- 주 포지션 우선 배정, 불가 시 부 포지션으로 대체
- MMR 차이가 적은 상위 3개 후보 조합 제시
- 후보 카드 내 멤버를 드래그앤드롭으로 교환하여 배치 수정 가능
- 수정된 조합은 "수정됨" 배지로 표시, MMR 실시간 재계산
- 리롤로 새로운 조합 생성 (수정 사항 초기화)
- 매칭 확정 시 서버에 경기를 생성하고 전적 페이지로 이동

### 전적 관리
- 진행 중인 매치를 전적 페이지 상단에 별도 표시
- 진행 중 매치에서 승리 팀 선택 또는 취소
- MMR 자동 반영: 승리 +25 / 패배 -25 (최소 0)
- 완료된 경기 목록을 최근순으로 조회 (팀 구성, 포지션, 승패)

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | TanStack Start (React 19) |
| Routing | TanStack Router |
| Data Fetching | TanStack Query |
| UI Components | Radix UI |
| Styling | vanilla-extract |
| Database | Turso (libSQL) / 로컬 JSON |
| Language | TypeScript |
| Build | Vite 7 |
| Deploy | Render |

## 개발 환경 설정

```bash
pnpm install
pnpm dev
```

DB 연결 없이 바로 개발을 시작할 수 있습니다. `NODE_ENV`가 production이 아니면 `data/` 디렉토리에 JSON 파일로 데이터가 저장됩니다.

프로덕션 환경에서는 Turso DB를 사용합니다. `.env` 파일에 다음 환경변수를 설정하세요:

```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```
