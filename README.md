# Naejeon Gogo - LoL 내전 밸런스 매칭

> MMR과 포지션을 고려한 공정한 5v5 자동 팀 매칭 웹 앱

<!-- 메인 스크린샷 또는 배너 이미지 -->
<!-- ![WAR 스크린샷](./docs/screenshot.png) -->

## 프로젝트 소개

LoL 내전을 진행할 때마다 수동으로 팀을 나누면 밸런스가 맞지 않고 시간이 오래 걸립니다. 내전고고는 멤버의 실력(MMR)과 포지션을 고려해 자동으로 균형 잡힌 5v5 팀을 매칭하고, 내전 전적을 누적 관리하여 점점 더 정확한 밸런스 매칭을 제공합니다.

## 주요 기능

### 멤버 관리
- 고정 멤버 등록/수정/삭제, 임시 참가자 추가
- 포지션 관리: 주 포지션 + 가능 포지션 (top / jungle / mid / adc / support)
- 멤버별 MMR 관리 (초기 1000, 수동 조정 가능)

### 자동 매칭
- 멤버 풀에서 10명 선택 → MMR + 포지션 밸런스 기반 5v5 팀 자동 구성
- MMR 차이가 적은 상위 3개 후보 조합 제시
- 마음에 들지 않으면 리롤로 새로운 조합 생성

### 전적 관리
- 경기 결과(승/패) 기록 및 날짜 자동 기록
- MMR 자동 반영: 승리 +25 / 패배 -25
- 개인 전적 조회 (총 승수, 패수, 승률, 현재 MMR)

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | TanStack Start (React 19) |
| Routing | TanStack Router |
| Data Fetching | TanStack Query |
| UI Components | Radix UI |
| Styling | vanilla-extract |
| Database | Turso (libSQL) |
| Language | TypeScript |
| Build | Vite 7 |
| Deploy | Render |
