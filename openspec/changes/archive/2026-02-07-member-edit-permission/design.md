## Context

현재 MemberCard는 `isAdmin`일 때만 `onEdit` 클릭이 활성화되고, MemberForm의 모든 필드가 동일하게 노출된다. 수정 권한을 세분화하여 비관리자도 기본 정보를 수정할 수 있도록 한다.

## Goals / Non-Goals

**Goals:**
- 비관리자도 멤버 카드 클릭으로 수정 폼 접근
- 비관리자 수정 폼에서 MMR 필드 disabled 처리
- 관리자는 기존과 동일하게 모든 필드 수정 가능

**Non-Goals:**
- 서버 사이드 권한 검증 (클라이언트 전용)
- 필드별 세부 권한 시스템 (MMR만 제한하면 충분)

## Decisions

### 1. MemberCard 클릭 항상 활성화
**선택**: `onEdit`를 관리자 여부와 무관하게 항상 호출.
**근거**: 비관리자도 수정 폼에 접근해야 하므로 카드 클릭을 차단하지 않음.

### 2. MemberForm에서 isAdmin 기반 MMR 필드 제어
**선택**: MemberForm 내부에서 `useAuth()`로 `isAdmin`을 확인하고, MMR input을 `disabled` 처리.
**근거**: 폼 컴포넌트가 자체적으로 권한을 확인하므로 prop 전달 불필요.

## Risks / Trade-offs

- **[클라이언트 전용 제한]** API를 직접 호출하면 MMR도 변경 가능 → 소규모 도구 특성상 수용.
