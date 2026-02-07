## ADDED Requirements

### Requirement: Render 배포 설정 파일
프로젝트 루트에 `render.yaml` 파일이 존재해야 한다(SHALL). 이 파일은 Render Web Service를 Docker 런타임으로 정의하며, 환경변수 `TURSO_DATABASE_URL`과 `TURSO_AUTH_TOKEN`을 sync: false로 선언해야 한다(SHALL).

#### Scenario: render.yaml로 서비스 배포
- **WHEN** Render에서 render.yaml을 감지할 때
- **THEN** Docker 기반 웹서비스가 포트 3000으로 생성되어야 한다

### Requirement: Fly.io 설정 제거
`fly.toml` 파일을 프로젝트에서 제거해야 한다(SHALL). mounts 설정 등 Fly.io 전용 설정이 더 이상 필요하지 않다.

#### Scenario: fly.toml 제거
- **WHEN** 배포 전환이 완료될 때
- **THEN** 프로젝트에 fly.toml 파일이 존재하지 않아야 한다

### Requirement: Dockerfile 호환성 유지
기존 Dockerfile은 Render Docker 배포에서도 그대로 사용 가능해야 한다(SHALL). 변경이 필요한 경우 최소한으로 수정한다.

#### Scenario: Render에서 Docker 빌드
- **WHEN** Render가 Dockerfile로 이미지를 빌드할 때
- **THEN** 빌드가 성공하고 포트 3000에서 앱이 실행되어야 한다
