# Strong Together App - Frontend (v5.0.0)

<p align="center">
  <img src="assets/icon.png" alt="Strong Together icon" width="140" />
</p>

[![CI](https://github.com/kobihanoch/Strong-Together-App/actions/workflows/ci.yml/badge.svg)](https://github.com/kobihanoch/Strong-Together-App/actions)

<p align="center">
  <strong>A production-minded fitness app built with React Native, Expo, TypeScript, secure mobile auth, realtime events, offline-first caching, and AI-assisted workout analysis.</strong>
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
  <img src="https://img.shields.io/badge/Tests-38%20files-16a34a" alt="Tests badge" />
</p>

Version 5.0.0 is a milestone release for the Strong Together client. It turns the app into a fully typed TypeScript codebase, expands automated test coverage across screens, hooks, contexts, and components, adds Sentry-based production monitoring, and introduces a new AI-powered exercise video analysis flow.

The app helps users plan workouts, track sessions, review progress, receive reminders, and stay engaged through a polished mobile experience backed by a dedicated Node.js/Express API.

> Backend repository: [Strong-Together-Backend](https://github.com/kobihanoch/Strong-Together-Backend)

## 🚀 TL;DR

- **React Native + Expo** fitness app shipped to the **App Store**
- Adds a new **AI video analysis** flow for supported exercises
- Fully migrated from **JavaScript** to **TypeScript** in **v5.0.0**
- Uses a custom **SWR-inspired cache layer** for **offline-first UX**
- Includes **OAuth**, **DPoP**, **realtime websocket events**, and **Sentry monitoring**
- Backed by a separate **Node.js / Express** backend and dedicated database layer

## Table of Contents

1. [TL;DR](#tldr)
2. [Overview](#overview)
3. [What is New in 5.0.0](#what-is-new-in-500)
4. [Core Product Features](#core-product-features)
5. [Engineering Highlights](#engineering-highlights)
6. [Architecture](#architecture)
7. [SWR-Inspired Cache Layer](#swr-inspired-cache-layer)
8. [Database Schemas](#database-schemas)
9. [Backend Flows in Short](#backend-flows-in-short)
10. [AI Analysis Flow](#ai-analysis-flow)
11. [Screenshots](#screenshots)
12. [Tech Stack](#tech-stack)
13. [Local Setup](#local-setup)
14. [Environment Variables](#environment-variables)
15. [Scripts](#scripts)
16. [Roadmap](#roadmap)
17. [License](#license)

## Overview

Strong Together is a cross-platform mobile fitness app focused on **consistency**, **training structure**, and **long-term progress tracking**.

Users can:

- build and manage **workout plans** with custom splits and exercises
- start **live workout sessions** and log sets, reps, and weight
- review **post-workout analytics** and adherence trends
- receive **reminders** and **in-app system messages**
- authenticate with **email/password** or **OAuth providers**
- analyze supported exercise videos through a new **AI-assisted workflow**

This repository contains the **frontend client only**. The backend, business rules, database definitions, scheduled jobs, and API implementation live in the dedicated backend repository.

## What is New in 5.0.0

This release is based on everything added after `v4.5.0` and represents a major **technical upgrade** rather than a cosmetic refresh.

- Full migration from **JavaScript** to **TypeScript** across screens, hooks, services, contexts, navigation, API layers, DTOs, and shared utilities
- New **AI video analysis** feature for exercise form review, including upload flow, background transfer, server job publishing, and websocket-driven results
- Large automated **test expansion** with coverage for app boot, page logic hooks, contexts, and UI components
- **CI pipeline** for running tests on pull requests
- **Sentry** integration for production error monitoring
- Continued support for the performance-focused architecture introduced in version 4.x: **bootstrap hydration**, **offline-aware cache usage**, and **realtime messaging**

## Core Product Features

- **Custom workout planning** with user-defined splits and exercise selection
- **Live workout tracking** with set-by-set logging for reps and weight
- **Analytics** and workout summaries for progress visibility
- **Cardio logging** and statistics support
- **In-app messaging** and reminder-oriented engagement flows
- Secure authentication with **email/password**, **Google**, and **Apple**
- **Offline-friendly behavior** backed by cache hydration and fallback fetch patterns
- **Realtime messaging/events** through authenticated websocket connections
- **Account management**, including profile updates and account deletion
- **AI video analysis** for supported exercises, currently focused on **squat analysis** in the first iteration

## Engineering Highlights

- Full **TypeScript** client migration
  The app now uses typed API contracts, DTOs, entities, hook props, context values, and navigation definitions.
- Test suite growth
  The repository now includes 38 test files covering screens, hooks, contexts, and components.
- CI enforcement
  GitHub Actions runs the automated test suite on pull requests.
- **Sentry** monitoring
  Production errors can now be tracked centrally, with noisy unauthorized events filtered out.
- **Offline-first UX**
  The client hydrates key domains from cache and falls back to API fetches when needed.
- **Bootstrap loading strategy**
  Core user data is fetched through a bootstrap path to reduce app startup chatter.
- Secure API communication
  The app includes **DPoP** proof support for bound requests and short-lived websocket ticket flows.

## Architecture

The project follows a clear client-server split:

```text
+-----------------------------+        HTTPS / WebSocket        +-----------------------------+
| React Native / Expo Client  | -----------------------------> | Node.js / Express Backend   |
| Strong Together Frontend    |                                | API, auth, jobs, DB access  |
+-----------------------------+                                +-----------------------------+
```

On the frontend side, the app is organized around:

- screens for top-level user flows
- components for reusable UI building blocks
- hooks for page logic and shared behavior
- contexts for authenticated app state
- services and typed API layers for backend communication
- websocket listeners for realtime updates
- cache utilities for hydration, recovery, and offline resilience

The backend is intentionally separated into its own repository to keep deployment, API evolution, and database ownership isolated from the mobile client.

## SWR-Inspired Cache Layer

One of the central ideas in the app is a custom **SWR-inspired** data flow built around [`hooks/useCacheAndFetch.ts`](C:/Development/Mobile%20Projects/Strong%20Together/Client/hooks/useCacheAndFetch.ts).

It works like this:

- build a stable **cache key** per user and domain
- hydrate data from **local cache first**
- render cached data immediately when available
- fetch fresh data from the **API** once server validation is complete
- write the updated payload back into cache for future launches

In practice, this gives the app a very mobile-friendly version of **stale-while-revalidate** behavior:

- **fast first paint** when cached data exists
- better **offline resilience**
- less perceived loading during navigation
- shared behavior across contexts such as **auth**, **workout**, **analysis**, **notifications**, and **cardio**

The hook is intentionally lightweight and app-specific rather than library-driven, which made it easier to adapt to your bootstrap flow, token validation timing, and cache persistence rules.

## Database Schemas

All database schemas belong to the backend repository, not this frontend client.

If you want to inspect the relational model, migrations, or server-side data structure, use:

- [Strong-Together-Backend](https://github.com/kobihanoch/Strong-Together-Backend)

This README no longer duplicates schema details here, so the source of truth stays in one place and does not drift.

## Backend Flows in Short

Even though the full schema lives in the backend repo, the main data flows are straightforward:

- **Workout flow**
  A user creates a workout plan, splits are attached to it, and exercises are assigned to each split.
- **Tracking flow**
  When a workout starts, the app logs performed sets and sends them back for persistence and later analytics.
- **Messages flow**
  System-generated messages are fetched, marked as read, and updated in realtime through the websocket layer.
- **Auth flow**
  Users sign in with credentials or OAuth, receive token-based access, and the client refreshes/validates sessions against the backend.
- **Reminder flow**
  The backend computes reminder timing and pushes notifications based on each user's workout schedule and settings.

For the exact relational structure, scheduled jobs, and DB ownership, the backend repository remains the single source of truth.

## AI Analysis Flow

The new **analysis flow** turns a workout video into asynchronous coaching feedback:

1. The user opens the analysis sheet from the workout screen.
2. The client selects and optionally trims/compresses the video.
3. The app requests a **presigned upload URL** from the backend.
4. The processed video is uploaded in the background.
5. The client publishes an **analysis job** to the server.
6. The app listens for the result through a **websocket event** tied to that job.
7. Once the server finishes processing, the result is rendered back in the sheet.

In the current version, the first supported exercise is **squat**, which keeps the UX focused while the pipeline is being proven end to end.

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

| Layer            | Technology                                                       |
| ---------------- | ---------------------------------------------------------------- |
| Mobile framework | React Native 0.81 + Expo 54                                      |
| Language         | TypeScript                                                       |
| Navigation       | React Navigation                                                 |
| State management | React Context + custom hooks                                     |
| Networking       | Axios                                                            |
| Realtime         | Socket.IO client                                                 |
| Monitoring       | Sentry                                                           |
| Testing          | Jest + Testing Library                                           |
| Auth             | JWT-based auth, OAuth, DPoP client proofs                        |
| Media flow       | Expo image/file tools, video trim/compression, presigned uploads |
| Backend          | Node.js + Express (separate repository)                          |

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

You can then open the app in an iOS simulator, Android emulator, or on a physical device through Expo.

## Environment Variables

Create a `.env` file in the project root and define the values needed for your environment.

| Variable                   | Purpose                                                          |
| -------------------------- | ---------------------------------------------------------------- |
| `EXPO_PUBLIC_ENVIRONMENT`  | Selects environment behavior such as `development` or production |
| `EXPO_PUBLIC_DEV_API`      | Backend base URL used in development mode                        |
| `EXPO_PUBLIC_API_URL`      | Backend base URL used outside development mode                   |
| `EXPO_PUBLIC_SUPABASE_URL` | Public storage base URL used for media/profile image access      |
| `EXPO_PUBLIC_SENTRY_DSN`   | Sentry DSN for production monitoring                             |

## Scripts

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `npm run start`     | Start the Expo development server |
| `npm run android`   | Open the app in Android flow      |
| `npm run ios`       | Open the app in iOS flow          |
| `npm run test`      | Run the Jest test suite           |
| `npm run lint`      | Run ESLint                        |
| `npm run typecheck` | Run TypeScript type checking      |

## Roadmap

- Expand AI analysis beyond squat to more exercises and richer feedback
- Deepen analytics and workout trend insights
- Continue improving reminder and habit-building flows
- Expand platform hardening around observability, release safety, and performance

## License

This project is licensed under the MIT License.
