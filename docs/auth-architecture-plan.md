# NTUMAI Auth Integration Architecture

## Current State Findings
- API layer exports (`src/api/index.ts`) reference modules that do not exist yet, making imports brittle and masking dead code paths.
- Auth flow mixes OTP-first logic with legacy password-based expectations across `src/api/auth.ts`, `src/services/authService.ts`, and `src/providers/AuthProvider.tsx`, so response shapes diverge.
- Session handling is duplicated between the Zustand slice and `AuthenticationService`, while `StorageManager` is unused for critical metadata like refresh expiry.
- UI flows (SelectMethod, OTP, Splash) rely on provider flags that are not synchronized with API mutations, which causes navigation guards to misfire when async races occur.

## Integration Goals
- Centralize all calls to the centralized auth provider (CAP) behind a deterministic contract and environment-aware configuration.
- Expose a unified domain service that hides transport details for OTP, password, and social flows so UI layers consume one interface.
- Guarantee consistent session lifecycle management (issue, refresh, revoke) with secure storage and predictable rehydration hooks.
- Support extensibility for CAP features such as 2FA, device binding, and multi-tenant routing without leaking provider logic upwards.
- Align UI modules with the canonical auth state machine (pre-auth, challenge, verified, onboarded) to simplify guards and transitions.

## Design Principles
- Layer isolation: transport adapters never mutate UI state directly; domain services act as the bridge into presentation.
- Typed contracts: requests and responses mirror CAP schemas, validated with zod, and exported from a single `schemas.ts` module.
- Side-effect control: async flows funnel through dedicated hooks (react-query or lightweight wrappers) with cancellation and retry support.
- Progressive enhancement: maintain mock adapters for offline development, gated through configuration flags.

## Layered Architecture Overview
- **Transport Layer**: `src/api/base` with `ApiClient`, shared interceptors, telemetry hooks, and WebSocket stubs.
- **Provider Adapters**: `src/api/modules/auth` for OTP, session, profile, social, and recovery endpoints backed by schema mappers.
- **Domain Services**: `src/domain/auth` hosting an `AuthCoordinator` and finite `AuthStateMachine` that orchestrate use cases.
- **State & Persistence**: `src/store/auth` exposes selectors fed by domain events; `src/persistence/sessionStorage` handles encrypted token caching and rotation.
- **Presentation**: `src/providers/AuthProvider`, navigation guards, and `components/auth` consume domain hooks like `useAuth`, `useOtpChallenge`, and render declarative states.

## Module Breakdown
- Transport enhancements: relocate `ApiClient` to `src/api/base/client.ts`, add interceptor registration (`authToken`, `errorNormalizer`, `telemetry`), and expose typed request helpers.
- Auth module: reorganize under `src/api/modules/auth/` with files for `otp.ts`, `session.ts`, `profile.ts`, and `social.ts`, all sharing CAP schema definitions.
- Domain layer: create `src/domain/auth/` with `AuthCoordinator`, `AuthStateMachine`, and facade hooks that emit typed results for the UI.
- Store alignment: replace the current Zustand slice with a thin cache updated by domain events; persistence uses secure storage plus metadata (deviceId, sessionId, expiresAt).
- UI alignment: map screens to state-machine states (`MethodSelection`, `OtpChallenge`, `Registration`, `ProfileCompletion`, `Authenticated`) so navigation is declarative.

## Auth Flow Sequence (OTP-first Example)
- User calls `useAuth().startChallenge` so the domain validates input and invokes `authAdapter.requestOtp` (POST `/v1/auth/challenges`).
- Domain stores the returned `challengeId`, updates countdown metadata, and exposes it to UI via `useOtpChallenge`.
- User enters OTP which calls `authAdapter.verifyOtp`; a successful response returns tokens and user snapshot, which the domain persists and emits.
- Domain triggers a `postAuthSync` pipeline (profile fetch, feature flags) before resolving navigation guards to route into the authenticated shell.
- Background refresh runs on a timer or interceptor hook and revokes the CAP session plus local cache on logout.

## Implementation Roadmap
- Phase 1: Clean current API exports, document CAP endpoints, introduce shared schema/type modules, and provide mock adapters for development parity.
- Phase 2: Implement the auth domain coordinator and state machine, refactor `AuthProvider` to consume it, and migrate the Zustand slice to listen for domain events.
- Phase 3: Update auth screens to use new hooks, consolidate OTP UI, and ensure navigation guards reference the domain state only.
- Phase 4: Wire CAP environments (dev/staging/prod), add secure storage (expo-secure-store fallback), implement refresh/revoke flows, and enable telemetry logging.
- Phase 5: Expand into optional flows (social login, 2FA, password reset), add integration tests against a mock server, and remove legacy services/mocks.

## Open Questions & Dependencies
- Need CAP contract details: endpoints, OAuth providers, token TTL, refresh cadence, and device-binding requirements.
- Decide on adopting react-query for request lifecycle management versus extending the existing client-side cache.
- Confirm storage encryption expectations (SecureStore vs AsyncStorage) across platforms and how CAP tracks device identifiers.
- Align UI/UX copy for multi-step flows (challenge plus profile completion) so the state machine mirrors product intent.
