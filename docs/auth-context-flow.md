# Auth Context Flow

## Table of Contents

1. [Purpose](#purpose)
2. [Flow Sketch](#flow-sketch)
3. [Session Bootstrap](#session-bootstrap)
4. [Login and OAuth](#login-and-oauth)
5. [Server Validation](#server-validation)
6. [Logout](#logout)
7. [Related Files](#related-files)

## Purpose

`AuthProvider` is now a thin coordinator for the mobile session lifecycle. It still exposes the auth context value, but the actual work is split into focused hooks for **startup**, **login/register/OAuth actions**, **server validation**, **cache hydration**, **socket initialization**, **global auth headers**, and **logout cleanup**.

This keeps the provider easy to scan: state lives in `AuthProvider.tsx`, while side effects live in named hooks under `features/auth/shared/hooks`.

## Flow Sketch

```text
AuthProvider
  |
  +-- useInitialCheck
  |     |
  |     +-- no refresh token/user id -> clearContext -> guest
  |     |
  |     +-- cached session ---------> authed -> useCacheAndFetch(user)
  |                                      |
  |                                      v
  |                                attemptServerValidation
  |
  +-- useAuthActions
  |     |
  |     +-- login / OAuth -> save refresh token -> GlobalAuth access token
  |                         -> CACHE:USER_ID -> authed + validated
  |
  +-- useAuthSocketInitialization -> connect after validated username
  |
  +-- useSyncUsernameHeader ------> keep API username header aligned
```

## Session Bootstrap

On mount, the provider checks two local values:

- `CACHE:USER_ID` from AsyncStorage-backed cache
- refresh token from secure token storage

`useInitialCheck` drives this flow. If either value is missing, it clears local auth state and moves the app to `authPhase: 'guest'`. If both exist, it restores the cached user id, sets `isLoggedIn`, switches `authPhase` to `authed`, and starts server validation.

The restored user id builds the auth cache key. Cached user data is loaded through `useCacheAndFetch`, so the app can show previously known user data while token validation runs in the background.

## Login and OAuth

Credential login, Google login, and Apple login all follow the same shape:

1. Call the relevant auth service.
2. Save the rotated refresh token.
3. Store the access token in `GlobalAuth`.
4. Save `CACHE:USER_ID`.
5. Mark the session as logged in, server-validated, and `authed`.
6. Let auth and domain providers start their cache-first fetch flow.

Register creates the account and shows a success notification asking the user to verify the account by email.

## Server Validation

`attemptServerValidation()` calls `refreshAndRotateTokens()` to prove the refresh token is still valid and receive a fresh access token.

Important behavior:

- A lock prevents duplicate validation calls during unstable network states.
- Network and server-down failures keep the user logged in with cached data.
- Upgrade-required responses open the update modal and stop API validation.
- True auth failures clear local session state.
- When validation succeeds, `isValidatedWithServer` becomes `true`, which tells cache-backed providers they may revalidate from the API.
- `useRetryServerValidationWhenOnline` retries validation after a boot-time network/server failure once the device is online again.
- `useAuthSocketInitialization` connects the socket only after the session is validated and the username is known.
- `useSyncUsernameHeader` keeps the request header username aligned with the current user.

## Logout

Logout is best-effort against the server, then always clears local state:

- refresh token is removed
- non-workout cache is cleared during auth cleanup
- all cache is cleared on explicit logout path
- access token and username headers are removed
- bootstrap payload is reset
- socket is disconnected
- auth state returns to `guest`

## Related Files

- `features/auth/shared/providers/AuthProvider.tsx`
- `features/auth/shared/hooks/use-auth-actions.hook.ts`
- `features/auth/shared/hooks/use-initial-check.hook.ts`
- `features/auth/shared/hooks/use-server-validation.hook.ts`
- `features/auth/shared/hooks/use-clear-context.hook.ts`
- `features/auth/shared/hooks/use-retry-server-validation-when-online.hook.ts`
- `features/auth/shared/hooks/use-auth-socket-initialization.ts`
- `features/auth/shared/hooks/use-sync-username-header.hook.ts`
- `features/auth/shared/utils/token-storage.utils.ts`
- `features/auth/shared/utils/auth.utils.ts`
- `features/auth/shared/services/auth.service.ts`
- `infrastructure/socket.ts`
