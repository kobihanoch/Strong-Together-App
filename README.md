# Strong Together App – Frontend (v4.1.0) 
<br><br>
<div align="center">
</div>

<p align="center">
  <img src="assets/icon.png" alt="Strong-Together-App Icon" width="150" />
</p>

<div align="center"><img src="https://img.shields.io/badge/Technologies-React%20Native%2C%20JavaScript%2C%20Expo%20Go-green" alt="Technologies" /></div>
<br><br>
<p align="center">
  <a href="https://apps.apple.com/app/id6745721821">
    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" height="48">
  </a>
</p>
<p align="center">
  <strong>📱 Now available on the <a href="https://apps.apple.com/app/id6745721821">App Store</a>!</strong>
</p>

---

Welcome to the **Strong Together App** - a cross-platform mobile application for planning, scheduling and tracking your workouts. The app lets athletes customize their workout plans, log exercise data, send messages, and stay accountable.

Version 4 introduces major improvements to performance, user experience, and cache architecture, including full offline support and a custom-built SWR-inspired cache layer.

> 👉 **The backend codebase is maintained in a dedicated repository:**  
> [`Strong-Together-Backend`](https://github.com/kobihanoch/Strong-Together-Backend)

## Table of Contents

1. [Project Overview](#project-overview)
2. [Screenshots](#screenshots)
3. [Main Features](#main-features)
4. [Architecture Overview](#architecture-overview)
5. [Tech Stack](#tech-stack)
6. [Installation & Setup](#installation--setup)
7. [Environment Variables](#environment-variables)
8. [Running the App Locally](#running-the-app-locally)
9. [Database Schema](#database-schema)
10. [Application Flows](#application-flows)
    - [Workout Flow](#workout-flow)
    - [Tracking Flow](#tracking-flow)
    - [Messages Flow](#messages-flow)
    - [Auth Flow](#auth-flow)
11. [Roadmap & Future Improvements](#roadmap--future-improvements)
12. [Contributing](#contributing)
13. [License](#license)

---

## Project Overview

The Strong Together App helps users build healthier habits by
combining **workout planning** and **exercise tracking**. Users can create custom workout plans with splits
and exercises, schedule workouts on specific days of the week,
receive notifications before a session and log each set’s weight and
repetitions. All data is stored in a
PostgreSQL database and synchronized with a backend API.

Version 3 separated the client and server into two distinct
repositories. While previous versions relied on Supabase client
libraries and server‑side functions written in Deno, I now use a
dedicated Node.js/Express API for authentication, CRUD operations, and WebSocket support for real-time messaging.

Version 4 builds on top of this by introducing a **smart cache layer**, **offline mode**, **bootstrap API logic**, and **a full UI redesign** - all tailored for high performance and low latency mobile experience.

---

## Screenshots

### App Previews

<div align="center">
  <img src="https://github.com/user-attachments/assets/24a25ef5-a434-49d6-8b8b-1a5b5d808cf9" alt="Home Screen" width="200" style="margin-right: 20px;"/>
  <img src="https://github.com/user-attachments/assets/46c7b894-5061-4d7f-82de-21e4dd4a1825" alt="Intro Screen" width="200"/>
</div>
<p align="center">
  <strong>Home Screen</strong>: Access fitness summaries and plans.  
  <br>
  <strong>Intro Screen</strong>: Onboarding walkthrough.
</p>
<br><br>
<div align="center">
  <img src="https://github.com/user-attachments/assets/7e4a8841-a23a-42bd-a82f-c6a5d83726e5" alt="Edit reps" width="200"/>
  <img src="https://github.com/user-attachments/assets/2740105b-1b40-4239-8451-dd910d5629fa" alt="Change exercise order" width="200"/>
  <img src="https://github.com/user-attachments/assets/9b0e89b7-437f-4a8c-9682-e4ff70f99903" alt="Add split" width="200"/>
</div>
<p align="center">
  <strong>Create/Modify</strong>: Edit your workout plan as how much you want.
</p>
<br><br>
<div align="center">
  <img src="https://github.com/user-attachments/assets/e755f060-8bd5-47a2-bb06-4f071fa04f9f" alt="Watch the Program Plan" width="200"/>
  <img src="https://github.com/user-attachments/assets/ad04532a-b656-4483-bbb6-a68723e5edad" alt="Watch the Program Plan" width="200"/>
</div>
<p align="center">
  <strong>Watch the Program Plan</strong>: View and manage workout plans.
</p>
<br><br>
<div align="center">
  <img src="https://github.com/user-attachments/assets/324fa910-1d07-40de-a260-d139429ac02e" alt="Watch the Program Plan" width="200"/>
  <img src="https://github.com/user-attachments/assets/ae6004ff-cb5a-4670-9de2-b519ebf41bbc" alt="Watch the Program Plan" width="200"/>
</div>
<p align="center">
  <strong>Train. Hard.</strong>: Start your live tracking.
</p>
<br><br>
<div align="center">
  <img src="https://github.com/user-attachments/assets/7f252f1b-f4bb-431b-9e74-e427e9f660f0" alt="After Workout Statistics" width="200" style="margin-right: 20px;"/>
  <img src="https://github.com/user-attachments/assets/43c5fc84-b3f5-4300-8fd7-edc24acdf9e0" alt="Compare to last workout" width="200"/>
  <img src="https://github.com/user-attachments/assets/c57f129e-defc-4ce1-8c4b-fc454fec55fb" alt="Compare to last workout" width="200"/>
  <img src="https://github.com/user-attachments/assets/f480110c-81af-48db-8d7a-e7a0c1edb133" alt="Compare to last workout" width="200"/>
  
</div>
<p align="center">
  <strong>Statistics and Workout Analysis</strong>: Summarized workout results.  
</p>
<br><br>
<div align="center">
  <img src="https://github.com/user-attachments/assets/b8364732-6a74-49b3-a881-6fbff174ce91" alt="Message Modal" width="200"/>
  <img src="https://github.com/user-attachments/assets/9d973ac3-cf98-4868-a29e-0471e088d8dc" alt="Message Modal" width="200"/>
</div>
<p align="center">
  <strong>Inbox</strong>: View system messages.
</p>

## Main Features

- **Custom workout plans** – Create workout plans containing
  configurable splits (e.g. push/pull/legs) and assign exercises to
  each split. Each user can design their own routines. (AI integration in next update).
- **Notifications** – Get a daily push notification.
- **Exercise tracking** – Log sets, repetitions and weight for each
  exercise. Tracking records are stored with a reference to the
  underlying split so you can review progress over time.
- **In‑app messaging** – Receive system messages at first login and after each successful workout.
- **Authentication & roles** – Sign up and log in securely, using access and refresh tokens. User
  accounts include profile information and optional push tokens for notifications.
- **Smart performance** – Heavy screens use `useMemo`,
  `useCallback` and context providers to avoid unnecessary re‑renders.
  Combined with batched API calls, these optimisations cut perceived
  navigation latency by **roughly 50 % compared with previous versions.**
- **Modular backend** – All network communication goes through a
  RESTful API implemented in a separate repository using Node.js and
  Express.
- **Smart SWR-style cache layer (NEW)** – A custom-built caching mechanism inspired by SWR, but implemented entirely without libraries. Each data context uses a unified hook (`useCacheAndFetch`) to hydrate from cache, fallback to API if needed, and auto-update in-memory state. Caching logic includes TTL support (planned), safe fallback handling, and background sync.
- **Bootstrap API pattern (NEW)** – On app launch, a single "bootstrap" call fetches all critical data (user profile, workouts, messages, etc.) to hydrate the app in one go. Greatly reduces network overhead and improves UX during initial load.
- **Offline mode support (NEW)** – All major screens load from cache when offline. Token refresh happens in background once network returns.
- **Unfinished workout recovery (NEW)** – If the app closes during an active workout, the session will be restored via cache flush when reopened.
- **User deletion support (NEW)** – Added the ability to permanently delete an account and all related data from the settings page.
- **Cardio input logging (NEW)** – Users can now log one cardio session per day (duration), to be expanded with full analytics in future releases.
- **Version-aware cache housekeeping (NEW)** – When the app updates, outdated cached data is safely cleaned to prevent inconsistency.

## Architecture Overview

The project follows a **two‑tier architecture**:

```
┌───────────────────────────┐     HTTPS        ┌─────────────────────────┐
│    React Native Client    │ ───────────────> │  Node.js/Express Server │
│   (Strong Together App)   │   API Requests   │      (Backend Repo)     │
└───────────────────────────┘                  └─────────────────────────┘
```

- **Frontend**
  - **General Structure** – built with React Native and
  supporting both iOS and Android. State is managed via React
  context and hooks, screens are organised under a specific folder
  and navigation is handled by React Navigation. The app interacts
  with the backend through a thin API client (e.g. using
  `axios`).

  - **Smart Caching Layer** – Each context in the app loads data through a custom hook that checks cache first, then falls back to API only if needed. A central cache store holds hydrated values for all major domains (workouts, messages, etc.), improving responsiveness across navigation.

  - **Bootstrap API Gate** – All contexts consume a unified `bootstrapAPIInstance` that populates them on app launch with one single API call. If bootstrap fails, each context falls back to individual endpoint logic. This reduces server load and perceived latency.

- **Backend** – a separate Node.js/Express server that exposes
  authenticated endpoints for users, workouts, exercises, messages
  and tracking. It uses PostgreSQL as its primary datastore and
  defines indexes and views to speed up complex queries.
  **[`Backend repository`](https://github.com/kobihanoch/Strong-Together-Backend) for Backend API documentation.**

> **Note:** When upgrading from version 2.x, be aware that all
> Supabase client calls have been removed from the frontend. Instead,
> configure the `API_URL` environment variable to point at your
> running Express server.

## Tech Stack

The main technologies and libraries used in the frontend and backend include:

| Layer                | Technology                                            |
| -------------------- | ----------------------------------------------------- |
| **Framework**        | [`React Native`](https://reactnative.dev/) (Expo/CLI) |
| **State management** | React Context + hooks (`useState`, `useReducer`)      |
| **Navigation**       | [`React Navigation`](https://reactnavigation.org/)    |
| **HTTP client**      | [`axios`](https://axios-http.com/)                    |
| **Backend API**      | Node.js + Express (separate repository)               |
| **Cache Layer**      | Server side Redis cache & Custom SWR-inspired logic at client side (`useCacheAndFetch`)        |
| **Bootstrap API**    | Unified bootstrap instance   |
| **Offline support**  | Built-in hydration from cache                         |
| **Deploying**        | Docker + Render                                       |
| **Database**         | Supabase PostgreSQL with indexes & views              |


## Installation & Setup

### Prerequisites

- **Node.js** ≥ 16.x and **npm** ≥ 7.x
- **Expo CLI** (`npm install -g expo-cli`) or React Native CLI
- A local copy of the [`Backend repository`](https://github.com/kobihanoch/Strong-Together-Backend) running on your
  machine or accessible via network

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kobihanoch/Strong-Together-App.git
   cd Strong-Together-App
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**. Copy the provided `.env.example`
   to `.env` and adjust the values as needed (see the
   [Environment Variables](#environment-variables) section for
   descriptions).

4. **Start your backend**. Follow the instructions in the backend
   repository to run the Express server locally. The frontend
   expects the API to be reachable at the `API_URL` you define in
   your `.env` file.

5. **Run the app**. For development with Expo, execute:

   ```bash
   npm run start
   ```

   This will launch the Expo Dev Tools where you can choose to run
   the app on an iOS simulator, Android emulator or a physical
   device via QR code.

## Environment Variables

The application uses environment variables (loaded via
`react-native-dotenv` or a similar library) to configure runtime
behaviour. Create a `.env` file in the project root with the
following keys:

| Variable                   | Description                                                    |
| -------------------------- | -------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL`      | Base URL of the Express backend (e.g. `http://localhost:5000`) |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase bucket url for media                                  |

You can add additional variables as needed by your backend (such
as analytics keys, feature flags, etc.). See `.env.example` for
defaults.

## Running the App Locally

Start the app:

| Command          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `npx expo start` | Launch Expo Dev Tools and run the app in development |

The first run may take a few minutes as Expo bundles your assets and
installs native modules.

## Database Schema

The backend uses PostgreSQL as its primary datastore. The schema
defines tables for users, messages, workout plans, splits, exercises
and tracking logs. The simplified ER diagram below shows how the
entities relate to each other:

![Database schema overview](https://github.com/user-attachments/assets/e9cdce3f-dc29-4034-8840-6a89a932df94)

Important points about the schema:

- **Users** table stores authentication credentials and profile
  metadata (`username`, `email`, `role`, `push_token`, etc.).
- **WorkoutPlans** contain high‑level programmes created by a user or
  trainer. Each plan has multiple **WorkoutSplits** (e.g. chest day,
  legs day).
- **Exercises** catalog the available movements along with
  descriptions and targeted muscle groups.
- **ExerciseToWorkoutSplit** is a join table mapping exercises to
  splits with an order index and number of sets.
- **ExerciseTracking** records actual performance data - weight and
  repetitions - for each workout date and split mapping.
- **ScheduledWorkouts** allows users to attach a split to a day of the
  week and optionally specify a notification time.
- **Messages** stores subject/body along with sender and receiver
  identifiers.
- **BlacklistedTokens** are used by the backend to invalidate JWTs
  after logout or password reset.

> **Optimisations:** In version 3, indexes were added on the
> foreign‑key columns (e.g. `workout_id`, `user_id`) and SQL views were
> introduced for common joins. These changes reduce query latency and
> improve performance when fetching nested data.

### Workout Flow

![Database workout flow](https://github.com/user-attachments/assets/7a634d62-9c30-4546-b24e-46df64781a6a)

1. **Create a Plan** – A user (or trainer) starts by creating a
   `WorkoutPlan` with a name and difficulty level. This inserts a
   record into the `workoutplans` table with a `user_id` pointing to
   the owner.
2. **Add Splits** – For each plan, the user defines one or more
   `WorkoutSplits`. Each split represents a training session (e.g.
   “Upper Body”) and is stored in the `workoutsplits` table with a
   foreign key back to its plan.
3. **Assign Exercises** – Using the exercise catalogue, the user
   selects movements for each split. These associations are stored
   in the `exercisetoworkoutsplit` table along with an order index
   (position in the workout) and planned number of sets.

### Tracking Flow

![Database workout tracking flow](https://github.com/user-attachments/assets/21dba52e-1cb9-459c-a2f6-2b4e9a3e9588)

- **Workouts**
  1. **Select a split** – On the day of training, the user
     opens a split and sees the list of exercises in order.
  2. **Record Sets** – For each exercise, the user logs weight and
     repetitions. Each entry is persisted as a row in the
     `exercisetracking` table with a reference to the
     `exercisetoworkoutsplit` identifier, the performing `user_id` and
     the date of the workout.
  3. **Review Progress** – The app aggregates tracking data to show
     charts of personal records, trends over time and progress against
     planned sets. These analytics are built on SQL views in the
     backend for efficiency.
- **Cardio**
  1. **Log daily** - log daily cardio, for now it's just walk/run, and duration.

### Messages Flow

![Database workout tracking flow](https://github.com/user-attachments/assets/d0e6754a-9123-4443-9fe5-eaecca6885a8)

1. **Compose Message** – System messages after a workout.
   Each message includes a `subject` and `msg` body. When a message
   is sent, a record is inserted into the `messages` table with
   `sender_id` and `receiver_id` foreign keys.
2. **Receive & Read** – Recipients fetch their inbox via the API.
   When a message is opened, the `is_read` flag is updated to `true`.
   The app may also use push notifications to alert users of new
   messages.
3. **Delete** – Messages can be removed from the inbox by issuing a delete request, which marks the record as
   deleted in the database.

### Auth Flow

![Database authentication flow](https://github.com/user-attachments/assets/1516ac04-941f-4792-a4c9-31036a1d9de2)

1. **Login & Token Issuance** – On successful login, the server issues an `access_token` (short-lived) and a `refresh_token` (long-lived).
2. **Access Control** – Each API request requires a valid `access_token`. If the token is missing, expired, or invalid, the request is denied.
3. **Token Refresh** – When the `access_token` expires, the client uses the `refresh_token` to obtain a new pair of tokens without re-logging in.
4. **Blacklisting** – On logout or suspected compromise, the `refresh_token` (and optionally the `access_token`) is stored in the `blacklistedtokens` table. Any attempt to reuse blacklisted tokens is rejected.

## Roadmap & Future Improvements

- **Group training features** – enable group plans where multiple users can share progress and compete.
- **Internationalisation** – expand language support beyond the current default and allow dynamic language switching.
- **Scheduling** - scheduled workouts in next update.
- **AI Integration** - for building workouts and analyzing performance.
- **Cache TTL enforcement** – currently TTL logic exists but is not yet enforced. Will be implemented in the next version to support true time-based cache invalidation.

## Contributing

Currently a personal project. Contributions are not open.  
(Will consider in future versions).

---

## License

This project is licensed under the **MIT License**.  
See the `LICENSE` file for details.

---

Thank you for checking out the Strong Together App! We hope this
updated README helps you get started quickly, understand the
underlying architecture and contribute effectively. Feel free to
open an issue if something is unclear or missing.
