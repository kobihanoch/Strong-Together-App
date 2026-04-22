# App Rendering Flow

## Table of Contents

1. [Purpose](#purpose)
2. [Startup Sequence](#startup-sequence)
3. [Auth-Gated Rendering](#auth-gated-rendering)
4. [Logged-In Provider Tree](#logged-in-provider-tree)
5. [Why This Matters](#why-this-matters)

## Purpose

The app shell in `App.tsx` keeps startup predictable by separating **platform initialization**, **session validation**, and **logged-in domain state**.

## Startup Sequence

1. `global.ts` is loaded before React Native app code so crypto/polyfill setup exists before infrastructure code runs.
2. Fonts are loaded with Expo Font, including local Poppins files, Inter fonts, and Material Community Icons.
3. `ensureDpopKeyPair()` prepares the local key pair needed for **DPoP-bound API requests**.
4. Cache housekeeping compares the stored cache version with `Constants.expoConfig.version` and removes stale `CACHE:` entries from older data structures while keeping `CACHE:USER_ID`.
5. The root is wrapped with Sentry, alert notification support, gesture handling, global loading, auth, navigation, app update modal support, and notifier support.

## Auth-Gated Rendering

`RootNavigator` reads `authPhase`, `isLoggedIn`, and `user` from `AuthProvider`.

- `authPhase === 'checking'` renders nothing to avoid flashing the wrong stack during session bootstrap.
- Logged-out users render `AuthStack`.
- Logged-in users render `AppWithProviders` with `key={user?.id}` so account changes remount app-scoped providers cleanly.

## Logged-In Provider Tree

The logged-in app mounts domain providers in this order:

```text
MessagesProvider
  WorkoutPlanProvider
    WorkoutHistoryProvider
      CardioProvider
        MainApp
```

`MainApp` renders the logged-in stack, notification setup, theme wrapper, and custom bottom tab bar.

## Why This Matters

This structure keeps **auth state** separate from **domain state**, avoids rendering private screens before session checks finish, and lets workout, message, history, and cardio providers hydrate independently after auth validation.
