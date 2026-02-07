### Requirement: CDN을 통한 모노스페이스 폰트 로드
애플리케이션은 JetBrains Mono 폰트를 외부 CDN에서 로드하여 모든 기기에서 동일한 모노스페이스 폰트가 렌더링되도록 SHALL 보장한다.

#### Scenario: 폰트가 설치되지 않은 기기에서 접속
- **WHEN** 사용자의 기기에 JetBrains Mono가 로컬 설치되어 있지 않은 상태에서 페이지에 접속한다
- **THEN** CDN에서 JetBrains Mono 폰트를 다운로드하여 모노스페이스 텍스트에 적용한다

#### Scenario: 폰트가 이미 설치된 기기에서 접속
- **WHEN** 사용자의 기기에 JetBrains Mono가 로컬 설치되어 있는 상태에서 페이지에 접속한다
- **THEN** 로컬 폰트 또는 CDN 캐시를 사용하여 추가 다운로드 없이 폰트가 적용된다

### Requirement: 폰트 로딩 중 텍스트 가시성 보장
폰트 로딩이 완료되기 전에도 모노스페이스 텍스트가 fallback 폰트로 SHALL 표시되어야 한다 (`font-display: swap`).

#### Scenario: 느린 네트워크에서 폰트 로딩 지연
- **WHEN** 네트워크가 느려 CDN 폰트 로딩이 지연된다
- **THEN** 브라우저 기본 monospace 폰트로 즉시 텍스트를 표시한 후, 폰트 로딩 완료 시 JetBrains Mono로 교체한다

### Requirement: CDN 장애 시 graceful degradation
CDN 장애 시에도 모노스페이스 텍스트는 브라우저 기본 monospace 폰트로 SHALL 표시되어야 한다.

#### Scenario: CDN 서버 응답 불가
- **WHEN** Google Fonts CDN이 응답하지 않는다
- **THEN** `font-family` fallback 체인에 따라 브라우저 기본 `monospace` 폰트로 텍스트가 정상 렌더링된다

### Requirement: 기존 폰트 로딩 패턴과의 일관성
JetBrains Mono CDN link는 기존 Pretendard CDN 로딩과 동일한 패턴(`__root.tsx`의 `links` 배열)으로 SHALL 추가되어야 한다.

#### Scenario: 앱 초기 로드 시 폰트 link 태그 렌더링
- **WHEN** 애플리케이션이 초기 로드된다
- **THEN** HTML `<head>`에 Pretendard CDN link와 JetBrains Mono CDN link가 모두 포함된다
