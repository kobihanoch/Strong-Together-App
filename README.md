# Strong Together App - Frontend (v5.2.0)

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

Strong Together is a fitness app **published on the App Store** for planning workouts, tracking live sessions, reviewing progress, receiving reminders, and analyzing workout videos through an **AI-assisted pipeline**.

The client is shaped around the details that make mobile software feel dependable: typed feature modules, secure token handling, **DPoP-bound requests**, app-version-aware cache cleanup, realtime event handling, Sentry monitoring, CI, and a focused Jest test suite behind a polished training experience.

> Backend repository: [Strong-Together-Backend](https://github.com/kobihanoch/Strong-Together-Backend)

## TL;DR

- **Live on the App Store**: Strong Together is a released mobile app, with production build configuration and real distribution.
- **End-to-end fitness product**: workout planning, live set tracking, cardio, analytics, reminders, messages, profile flows, and AI-assisted video analysis.
- **Mobile architecture with depth**: feature-sliced code, typed API services, domain providers, custom cache hydration, and auth-gated rendering.
- **Security beyond basic JWTs**: OAuth, secure refresh-token storage, in-memory access tokens, **DPoP key binding**, and signed per-request proofs.
- **Production feedback loops**: Sentry tracing, error boundaries, update-required handling, offline/server-down alerts, CI, and broad unit coverage.

## Table of Contents

1. [TL;DR](#tldr)
2. [Why This Project Stands Out](#why-this-project-stands-out)
3. [Product Features](#product-features)
4. [Engineering Highlights](#engineering-highlights)
5. [Architecture](#architecture)
6. [Documentation](#documentation)
7. [Screenshots](#screenshots)
8. [Tech Stack](#tech-stack)
9. [Local Setup](#local-setup)
10. [Environment Variables](#environment-variables)
11. [Scripts](#scripts)
12. [Roadmap](#roadmap)
13. [License](#license)

## Why This Project Stands Out

- **Published mobile product**: available on the **App Store**, with release configuration that separates production and development builds.
- **Production frontend architecture**: feature-based modules, typed services, domain providers, shared infrastructure, and reusable UI primitives.
- **Secure auth flow**: email/password, **Google**, **Apple**, refresh-token rotation, secure token storage, and **DPoP** proof support.
- **Offline-first experience**: custom **SWR-inspired cache layer** hydrates core screens before fresh API data arrives.
- **Realtime UX**: authenticated Socket.IO flow for in-app messages and asynchronous AI analysis results.
- **AI workout analysis**: video selection, trimming/compression guardrails, presigned upload, upload progress, Sentry tracing, and websocket result delivery.
- **Quality practices**: **TypeScript**, **Jest**, Testing Library, CI on pull requests, Sentry error boundaries, and app-version-aware cache cleanup.

## Product Features

- Create and edit **custom workout plans** with splits and exercises.
- Start **live workout sessions** and log sets, reps, and weights.
- Compare current training with **previous workout data**.
- Review **statistics**, summaries, adherence trends, and estimated strength insights.
- Track **cardio** activity with daily and weekly views.
- Receive **system messages**, reminders, and push notification settings.
- Manage profile details, profile images, account state, and authentication.
- Run **AI-assisted squat analysis** from a workout video.

## Engineering Highlights

| Area              | What was built                                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App shell**     | Font loading, DPoP key bootstrap, versioned cache housekeeping, auth-gated navigation, global loading, Sentry boundary, update modal, and app-scoped providers. |
| **Data layer**    | Typed Axios services, request/response interceptors, bootstrap response slicing, cache TTLs, retry-on-401 refresh flow, and app version headers.                |
| **State model**   | Focused contexts for **auth**, **messages**, **workout plan**, **workout history**, and **cardio** instead of one oversized global store.                       |
| **Security**      | Secure refresh token storage, access token in memory, OAuth providers, short-lived websocket tickets, DPoP key binding, and DPoP request proofs.                |
| **Resilience**    | Offline detection, cached startup data, cache invalidation by app version, network/server-down alerts, and best-effort logout cleanup.                          |
| **Observability** | Sentry setup, error boundary fallback, request tracing headers, HTTP spans, and traced video-analysis lifecycle spans.                                          |
| **Testing**       | 36 test files covering screens, hooks, providers, contexts, components, and app boot behavior.                                                                  |

## Architecture

```text
+-----------------------------+        HTTPS / WebSocket        +-----------------------------+
| React Native / Expo Client  | -----------------------------> | Dedicated Backend API       |
| Strong Together Frontend    |                                | API, auth, jobs, DB access  |
+-----------------------------+                                +-----------------------------+
```

The frontend is organized by **feature domains**:

- `features/auth` - login, register, OAuth, token lifecycle, and session context
- `features/workouts` - planning, live session tracking, history, analytics, cardio, and AI analysis
- `features/messages` - inbox state, unread derivation, and realtime updates
- `features/profile` - media upload and profile editing
- `infrastructure` - API client, interceptors, cache, DPoP, sockets, and Sentry
- `shared` - reusable components, hooks, providers, constants, and alert utilities

The backend owns database schemas, scheduled jobs, API implementation, and server-side business rules. This client keeps its responsibility focused on mobile UX, state, rendering, networking, and device integrations.

## Documentation

The README stays recruiter-friendly and compact. Deeper technical notes live here:

- [App rendering flow](docs/app-rendering-flow.md) - startup, auth gating, provider order, and logged-in rendering.
- [Auth context flow](docs/auth-context-flow.md) - login/register/OAuth, cached sessions, refresh validation, logout, and socket setup.
- [DPoP security flow](docs/dpop-security-flow.md) - key generation, token binding, signed request proofs, and access-token hashing.
- [Custom SWR cache flow](docs/custom-swr-cache-flow.md) - cache keys, hydration, revalidation, TTLs, bootstrap, and provider usage.
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
