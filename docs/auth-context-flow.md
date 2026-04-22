# Auth Context Flow

## Table of Contents

1. [Purpose](#purpose)
2. [Session Bootstrap](#session-bootstrap)
3. [Login and OAuth](#login-and-oauth)
4. [Server Validation](#server-validation)
5. [Logout](#logout)
6. [Related Files](#related-files)

## Purpose

`AuthProvider` owns the mobile session lifecycle: **user state**, **login/register/OAuth actions**, **cached session recovery**, **server validation**, **refresh token rotation**, **socket initialization**, and **logout cleanup**.

## Session Bootstrap

On mount, the provider checks two local values:

- `CACHE:USER_ID` from AsyncStorage-backed cache
- refresh token from secure token storage

If either value is missing, the user becomes a guest. If both exist, the app sets `isLoggedIn`, switches `authPhase` to `authed`, builds the auth cache key, and starts server validation.

Cached user data is loaded through `useCacheAndFetch`, so the app can show previously known user data while validation runs.

## Login and OAuth

Credential login, Google login, and Apple login all follow the same shape:

1. Call the relevant auth service.
2. Save the rotated refresh token.
3. Store the access token in `GlobalAuth`.
4. Save `CACHE:USER_ID`.
5. Mark the session as validated.
6. Let domain providers start their cache-first fetch flow.

Register creates the account and shows a success notification asking the user to verify the account by email.

## Server Validation

`attemptServerValidation()` calls `refreshAndRotateTokens()` to prove the refresh token is still valid and receive a fresh access token.

Important behavior:

- A lock prevents duplicate validation calls during unstable network states.
- Network and server-down failures keep the user logged in with cached data.
- Upgrade-required responses open the update modal and stop API validation.
- True auth failures clear local session state.
- When validation succeeds, `isValidatedWithServer` becomes `true`, which tells app providers they may revalidate from the API.

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
- `features/auth/shared/utils/token-storage.utils.ts`
- `features/auth/shared/utils/auth.utils.ts`
- `features/auth/shared/services/auth.service.ts`
- `infrastructure/socket.ts`
