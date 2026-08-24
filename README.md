# Strong Together App - Frontend (v5.2.1)

<p align="center">
  <img src="assets/icon.png" alt="Strong Together icon" width="140" />
</p>

[![CI](https://github.com/kobihanoch/Strong-Together-App/actions/workflows/ci.yml/badge.svg)](https://github.com/kobihanoch/Strong-Together-App/actions)

<p align="center">
  <strong>A fitness app published on the App Store, built with React Native, Expo, TypeScript, secure mobile auth, realtime events, offline-first caching, and AI-assisted workout analysis.</strong>
</p>

<p align="center">
  <a href="https://apps.apple.com/app/id6745721821">
    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" height="48">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.81-20232A?logo=react" alt="React Native badge" />
  <img src="https://img.shields.io/badge/Expo-54-111827?logo=expo" alt="Expo badge" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript badge" />
  <img src="https://img.shields.io/badge/Tests-36%20files-16a34a" alt="Tests badge" />
</p>

Strong Together is a **published React Native fitness app** for workout planning, live session tracking, cardio, analytics, reminders, messages, profile management, and **AI-assisted squat analysis**.

This is a production-level mobile frontend with **secure auth**, **DPoP-bound API requests**, **session restoration**, **custom SWR-style caching**, **realtime Socket.IO events**, **Sentry monitoring**, and a typed feature-based architecture.

> Backend repository: [Strong-Together-Backend](https://github.com/kobihanoch/Strong-Together-Backend)

## Key Highlights

- **Authentication flow**: email/password, **Google**, and **Apple** auth with SecureStore refresh-token persistence, in-memory access tokens, server validation, logout cleanup, and DPoP request proofs.
- **State management architecture**: focused **React Context** providers, custom hooks, domain-specific state boundaries, and cache-backed hydration for core logged-in data.
- **API integration**: real dedicated backend, typed Axios services, request/response interceptors, `401` refresh handling, update-required responses, network alerts, and shared error handling.
- **Performance optimizations**: memoized derived data, cache-first startup, versioned cache invalidation, bootstrap response slicing, and global loading coordination.
- **Async / realtime behavior**: authenticated Socket.IO flow for messages and AI analysis results, presigned video upload, upload progress, cancellation cleanup, and websocket result delivery.
- **Separation of concerns**: screens compose hooks and components; hooks own workflow logic; services own backend calls; infrastructure owns cache, API, sockets, Sentry, and DPoP.
- **Reusable component architecture**: shared components, feature-local UI components, typed navigation, alert utilities, and app-scoped providers mounted only in the authenticated app branch.

## Table of Contents

1. [Product Scope](#product-scope)
2. [App Architecture](#app-architecture)
3. [Frontend Engineering Decisions & Tradeoffs](#frontend-engineering-decisions--tradeoffs)
4. [Auth Flow](#auth-flow)
5. [Data, Cache, and API Flow](#data-cache-and-api-flow)
6. [Engineering Highlights](#engineering-highlights)
7. [Documentation](#documentation)
8. [Screenshots](#screenshots)
9. [Tech Stack](#tech-stack)
10. [Local Setup](#local-setup)
11. [Environment Variables](#environment-variables)
12. [Scripts](#scripts)
13. [Roadmap](#roadmap)
14. [License](#license)

## Product Scope

- Build and edit **custom workout plans** with splits and exercises.
- Track **live workouts** with sets, reps, weights, notes, and previous workout comparison.
- Review **statistics**, adherence trends, cardio history, and estimated strength insights.
- Manage **messages**, reminders, push notification settings, profile details, and profile images.
- Run **AI-assisted squat analysis** from selected workout videos.

## App Architecture

```text
+-----------------------------+        HTTPS / WebSocket        +-----------------------------+
| React Native / Expo Client  | -----------------------------> | Dedicated Backend API       |
| Strong Together Frontend    |                                | API, auth, jobs, DB access  |
+-----------------------------+                                +-----------------------------+
```

### Feature Structure

- `features/auth` - login, register, OAuth, token lifecycle, session validation, and auth context.
- `features/workouts` - workout planning, live sessions, history, analytics, cardio, and AI analysis.
- `features/messages` - inbox state, unread derivation, message actions, and realtime updates.
- `features/profile` - profile editing, profile image selection, and media upload services.
- `features/settings` - push notification permission flow and settings UI.
- `infrastructure` - Axios, interceptors, cache utilities, DPoP helpers, sockets, and Sentry.
- `navigation` - authenticated and unauthenticated stacks with typed route params.
- `shared` - reusable components, hooks, providers, alerts, constants, and utilities.

### Screen / Navigation Structure

- `App.tsx` loads fonts, bootstraps DPoP keys, runs cache housekeeping, mounts Sentry/alert roots, and gates rendering through `AuthProvider`.
- `AuthStack` renders onboarding, login, register, and verification screens.
- `AppStack` renders Home, Settings, Profile, Workout Plan, Start Workout, Create Workout, Statistics, Inbox, and Analytics.
- Logged-in screens are wrapped with app-scoped providers for **messages**, **workout plan**, **workout history**, and **cardio**.

Detailed reference: [App rendering flow](docs/app-rendering-flow.md).

### State Flow

State is kept in focused domain providers:

- **Auth/session**: `AuthProvider`
- **Workout plan**: `WorkoutPlanProvider`
- **Workout history / analytics source data**: `WorkoutHistoryProvider`
- **Cardio**: `CardioProvider`
- **Messages**: `MessagesProvider`
- **Screen-only UI state**: feature hooks and local component state

```text
Provider state -> feature hook -> screen composition -> presentational components
```

Detailed references: [Auth context flow](docs/auth-context-flow.md), [Custom SWR cache flow](docs/custom-swr-cache-flow.md).

### Data Flow

```text
Backend API -> typed service -> provider / feature hook -> derived state -> UI
```

- **Services** own backend requests.
- **Hooks** coordinate async workflows, navigation decisions, form behavior, and derived view models.
- **Components** render reusable or feature-local UI.
- **Infrastructure** centralizes API interception, cache, DPoP, sockets, and Sentry.

Detailed reference: [API, realtime, and AI analysis flow](docs/api-realtime-ai-flow.md).

## Frontend Engineering Decisions & Tradeoffs

- **Custom hooks** keep screens thin and move workflows like auth startup, cache hydration, workout creation, media upload, and AI analysis into testable units.
- **React Context** fits the app because shared state is domain-based and mostly server-backed; it avoids heavier global state tooling while keeping cross-screen data accessible.
- **Feature-sliced structure** keeps components, hooks, services, types, and utils close to their domain, which improves maintainability as the product grows.
- **Cache-first hydration** improves mobile startup speed and offline resilience, with the tradeoff of needing careful server validation and app-version cache cleanup.
- **Centralized interceptors** reduce duplicated API code, with the tradeoff that auth, DPoP, tracing, and error handling must be documented clearly.
- **Reusable shared UI** is used for common primitives, while feature-specific components stay near the screens that own their behavior.

Deeper documentation:

- [App rendering flow](docs/app-rendering-flow.md)
- [Custom SWR cache flow](docs/custom-swr-cache-flow.md)
- [API, realtime, and AI analysis flow](docs/api-realtime-ai-flow.md)
- [Error alerts and UX feedback](docs/error-alerts.md)

## Auth Flow

Authentication is handled as an app-level flow, not just a login screen.

### Login

- Users authenticate with **email/password**, **Google**, or **Apple**.
- Auth actions call typed service functions and update `AuthProvider`.
- Refresh tokens are persisted securely; access-token behavior is kept short-lived/in-memory.

### Session Restore

- On startup, `AuthProvider` runs an initial session check.
- Cached user/session identifiers allow fast hydration of known user data.
- Server validation controls when API-backed providers can revalidate fresh data.

### Auth State Maintenance

- `AuthProvider` owns `isLoggedIn`, user data, auth phase, validation state, and auth actions.
- Auth-gated rendering prevents the wrong navigation tree from flashing.
- Socket setup happens only after the session is validated and user data is available.

### Invalid Sessions

- Axios interceptors handle `401` responses and refresh attempts.
- Failed validation or invalid refresh state clears auth-sensitive context and cache state.
- Offline/server-down cases are handled separately so cached data can remain useful when appropriate.

Detailed references:

- [Auth context flow](docs/auth-context-flow.md)
- [DPoP security flow](docs/dpop-security-flow.md)
- [App rendering flow](docs/app-rendering-flow.md)

## Data, Cache, and API Flow

The app uses a custom **SWR-inspired cache pattern**:

```text
Known user id -> cache key -> cached payload -> UI hydration -> server revalidation -> cache update
```

Used for:

- Auth/user data
- Workout plan
- Workout history
- Messages
- Cardio-related state

API behavior is centralized:

- Request interceptors inject **tracing**, **app-version**, and **DPoP** headers.
- Bootstrap response slicing can serve tracked startup data without repeated network calls.
- Response interceptors handle **update-required**, **offline/server-down**, **401 refresh**, and fallback errors.
- Sentry traces HTTP spans and video-analysis lifecycle spans.

Detailed references:

- [Custom SWR cache flow](docs/custom-swr-cache-flow.md)
- [API, realtime, and AI analysis flow](docs/api-realtime-ai-flow.md)
- [Error alerts and UX feedback](docs/error-alerts.md)

## Engineering Highlights

| Area              | What was built                                                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App shell**     | Font loading, DPoP key bootstrap, versioned cache housekeeping, auth-gated navigation, global loading, Sentry boundary, update modal, and app-scoped providers.         |
| **Data layer**    | Typed Axios services, interceptors, bootstrap response slicing, versioned cache keys, retry-on-401 refresh flow, and app-version headers.                              |
| **State model**   | Focused contexts for auth, messages, workout plan, workout history, and cardio, with side effects split into dedicated hooks.                                          |
| **Security**      | Secure refresh-token storage, in-memory access-token handling, OAuth providers, short-lived websocket tickets, DPoP key binding, and signed request proofs.            |
| **Resilience**    | Offline detection, cached startup data, cache invalidation by app version, network/server-down alerts, and best-effort logout cleanup.                                 |
| **Realtime / AI** | Socket.IO messages, websocket-delivered AI analysis results, video selection, trimming/compression guardrails, presigned upload, progress tracking, and cancellation.   |
| **Observability** | Sentry setup, error boundary fallback, request tracing headers, HTTP spans, and video-analysis lifecycle spans.                                                        |
| **Testing**       | 36 test files covering screens, hooks, providers, contexts, components, and app boot behavior.                                                                         |

## Documentation

High-level README sections link into deeper technical notes:

- [App rendering flow](docs/app-rendering-flow.md) - startup, auth gating, provider order, and logged-in rendering.
- [Auth context flow](docs/auth-context-flow.md) - provider responsibilities, startup hooks, login/register/OAuth, cached sessions, refresh validation, logout, and socket setup.
- [DPoP security flow](docs/dpop-security-flow.md) - key generation, token binding, signed request proofs, and access-token hashing.
- [Custom SWR cache flow](docs/custom-swr-cache-flow.md) - cache keys, hydration, revalidation, bootstrap, and provider usage.
- [API, realtime, and AI analysis flow](docs/api-realtime-ai-flow.md) - Axios interceptors, DPoP, websocket tickets, messages, and video analysis.
- [Error alerts and UX feedback](docs/error-alerts.md) - shared error alerts, network alerts, update-required handling, and success notifications.

## Screenshots

<div align="center">
  <img src="https://github.com/user-attachments/assets/24a25ef5-a434-49d6-8b8b-1a5b5d808cf9" alt="Home screen" width="180" />
  <img src="https://github.com/user-attachments/assets/563ff3b9-58ea-4c8a-a98e-93acdabfd40f" alt="Intro screen" width="180" />
</div>

<p align="center">
  <strong>Home Screen</strong> and <strong>Onboarding</strong>
</p>

<div align="center">
  <img src="https://github.com/user-attachments/assets/7e4a8841-a23a-42bd-a82f-c6a5d83726e5" alt="Edit reps screen" width="180" />
  <img src="https://github.com/user-attachments/assets/2740105b-1b40-4239-8451-dd910d5629fa" alt="Change exercise order screen" width="180" />
  <img src="https://github.com/user-attachments/assets/9b0e89b7-437f-4a8c-9682-e4ff70f99903" alt="Add split screen" width="180" />
</div>

<p align="center">
  <strong>Create and Edit Workout Plans</strong>
</p>

<div align="center">
  <img src="https://github.com/user-attachments/assets/24a25ef5-a434-49d6-8b8b-1a5b5d808cf9" alt="Home screen" width="180" />
  <img src="https://github.com/user-attachments/assets/e755f060-8bd5-47a2-bb06-4f071fa04f9f" alt="Workout plan screen" width="180" />
  <img src="https://github.com/user-attachments/assets/ad04532a-b656-4483-bbb6-a68723e5edad" alt="Workout plan details screen" width="180" />
</div>

<p align="center">
  <strong>Workout Plan Views</strong>
</p>

<div align="center">
  <img src="https://github.com/user-attachments/assets/324fa910-1d07-40de-a260-d139429ac02e" alt="Live workout screen" width="180" />
  <img src="https://github.com/user-attachments/assets/ae6004ff-cb5a-4670-9de2-b519ebf41bbc" alt="Live workout details screen" width="180" />
</div>

<p align="center">
  <strong>Live Workout Tracking</strong>
</p>

<div align="center">
  <img src="https://github.com/user-attachments/assets/7f252f1b-f4bb-431b-9e74-e427e9f660f0" alt="Statistics screen" width="180" />
  <img src="https://github.com/user-attachments/assets/43c5fc84-b3f5-4300-8fd7-edc24acdf9e0" alt="Compare to last workout screen" width="180" />
  <img src="https://github.com/user-attachments/assets/c57f129e-defc-4ce1-8c4b-fc454fec55fb" alt="Workout analysis screen" width="180" />
  <img src="https://github.com/user-attachments/assets/f480110c-81af-48db-8d7a-e7a0c1edb133" alt="Workout summary screen" width="180" />
</div>

<p align="center">
  <strong>Statistics and Workout Analysis</strong>
</p>

<div align="center">
  <img src="https://github.com/user-attachments/assets/b8364732-6a74-49b3-a881-6fbff174ce91" alt="Inbox screen" width="180" />
  <img src="https://github.com/user-attachments/assets/9d973ac3-cf98-4868-a29e-0471e088d8dc" alt="Message screen" width="180" />
</div>

<p align="center">
  <strong>Inbox and System Messages</strong>
</p>

## Tech Stack

| Layer            | Technology                                                  |
| ---------------- | ----------------------------------------------------------- |
| Mobile framework | React Native 0.81 + Expo 54                                 |
| Language         | TypeScript 5.9                                              |
| Navigation       | React Navigation                                            |
| State            | React Context + custom hooks                                |
| Networking       | Axios with typed services                                   |
| Realtime         | Socket.IO client                                            |
| Monitoring       | Sentry                                                      |
| Testing          | Jest + Testing Library                                      |
| Auth             | JWT, OAuth, SecureStore, DPoP                               |
| Media            | Expo media tools, video trim/compression, presigned uploads |
| Backend          | Dedicated API in a separate repository                      |

## Local Setup

### Prerequisites

- Node.js 20+
- npm
- Expo tooling
- Running backend instance from the backend repository

### Install

```bash
git clone https://github.com/kobihanoch/Strong-Together-App.git
cd Strong-Together-App
npm install
```

### Run

```bash
npm run start
```

Open the app in an iOS simulator, Android emulator, or physical device through Expo.

## Environment Variables

Create a `.env` file in the project root.

| Variable                   | Purpose                                                           |
| -------------------------- | ----------------------------------------------------------------- |
| `EXPO_PUBLIC_ENVIRONMENT`  | Selects environment behavior such as `development` or production. |
| `EXPO_PUBLIC_DEV_API`      | Backend base URL used in development mode.                        |
| `EXPO_PUBLIC_API_URL`      | Backend base URL used outside development mode.                   |
| `EXPO_PUBLIC_SUPABASE_URL` | Public storage base URL used for media/profile image access.      |
| `EXPO_PUBLIC_SENTRY_DSN`   | Sentry DSN for production monitoring.                             |

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run start`     | Start the Expo development server. |
| `npm run android`   | Open the app in Android flow.      |
| `npm run ios`       | Open the app in iOS flow.          |
| `npm run web`       | Start Expo web mode.               |
| `npm run test`      | Run the Jest test suite.           |
| `npm run lint`      | Run ESLint.                        |
| `npm run typecheck` | Run TypeScript type checking.      |

## Roadmap

- Expand **AI analysis** beyond squat to more exercises and richer feedback.
- Deepen **analytics** around strength trends, adherence, and recovery.
- Improve reminders and habit-building flows.
- Continue hardening observability, release safety, and performance.

## License

This project is licensed under the MIT License.
