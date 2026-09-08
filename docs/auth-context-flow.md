# Authentication lifecycle

## Responsibility

`AuthProvider` owns only the mobile session lifecycle:

- `authPhase`: `checking`, `authed`, or `guest`;
- cached authenticated user ID;
- whether this run has been validated with the server;
- login completion and idempotent logout;
- startup validation and online retry.

The current user profile is TanStack Query data, not auth context state.

## Restore and validation

```mermaid
sequenceDiagram
    participant App
    participant Auth as AuthProvider
    participant Secure as SecureStore
    participant API
    participant Query as Feature queries
    App->>Auth: Mount
    Auth->>Secure: Read user ID + refresh token
    alt either value is missing
        Auth->>Auth: logout cleanup -> guest
    else both exist
        Auth->>Auth: authed (cached UI may render)
        Auth->>API: refreshSessionOnce()
        alt valid
            API-->>Auth: access token + rotated refresh token + user ID
            Auth->>Secure: Save rotation atomically
            Auth->>Auth: validated = true
            Auth->>Query: Enable fresh requests
        else offline/server unavailable/upgrade required
            Auth->>Auth: Keep cached session; validated = false
        else invalid session
            Auth->>Auth: Full logout
        end
    end
```

An online-status hook retries validation after a boot-time connectivity failure. It does not retry before the initial attempt or after validation has succeeded.

## Login and OAuth

Password, Google, and Apple flows call separate typed services but converge on `completeAuthSession(accessToken, refreshToken, userId)`:

1. Persist refresh token and user ID in SecureStore.
2. Install the access token in the shared Axios client's in-memory header.
3. Reset forced-logout state.
4. enter `authed` and mark the session server-validated.

One convergence point prevents OAuth and password login from drifting into different session semantics.

## Race-safe token rotation

`refreshSessionOnce` is a single-flight transaction. Startup validation and every `401` handler join the same promise. Waiting requests are released only after the rotated refresh token/user ID are persisted and the new access token is active.

`sessionGeneration` changes when logout starts. A refresh captures the generation before network I/O and refuses to install its result if the session changed meanwhile. This closes the classic “logout, then a late refresh logs me back in” race.

On `401`, the interceptor first checks whether another request already installed a newer Authorization header. If so, it retries with that token; otherwise it joins the refresh transaction. Each original request is retried once.

## Logout contract

Logout is idempotent: simultaneous callers share `logoutPromiseRef`. The API logout is best effort, but local cleanup always runs:

- invalidate in-flight refreshes;
- enter the guest phase and disable validated queries;
- clear SecureStore auth values;
- cancel and remove the persisted workout session/reminder;
- clear in-memory and persisted TanStack Query data;
- remove access-token and username headers;
- reset validation guards;
- unmount authenticated effects, removing socket listeners and disconnecting the socket.

This ordering prioritizes local security and predictable UI even when the server cannot be reached.

## Why these decisions

- SecureStore protects durable credentials better than general app storage.
- In-memory access tokens reduce exposure at rest.
- Cached UI and server validation are separate so offline use does not imply trusted online access.
- Connectivity failures preserve work; definitive authentication failures clear it.
- Locks, single-flight refresh, and generation guards make asynchronous auth deterministic.

Related files: `features/auth/providers/AuthProvider.tsx`, `features/auth/services/auth.service.ts`, `features/auth/hooks/auth-provider-effects/`, and `features/auth/utils/token-storage.utils.ts`.
