# Strong Together App – Frontend (v4.4.0)

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

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Screenshots](#screenshots)
3. [Main Features](#main-features)
4. [Architecture Overview](#architecture-overview)
5. [Realtime Messaging (WebSocket)](#realtime-messaging-websocket)
6. [Tech Stack](#tech-stack)
7. [Installation & Setup](#installation--setup)
8. [Environment Variables](#environment-variables)
9. [Running the App Locally](#running-the-app-locally)
10. [Database Schema](#database-schema)
11. [Application Flows](#application-flows)
    - [Workout Flow](#workout-flow)
    - [Tracking Flow](#tracking-flow)
    - [Messages Flow](#messages-flow)
    - [Auth Flow](#auth-flow)
    - [OAuth Integration (Google & Apple)](#oauth-integration-google--apple)
12. [Roadmap & Future Improvements](#roadmap--future-improvements)
13. [Contributing](#contributing)
14. [License](#license)

---

## Project Overview

The Strong Together App helps users build healthier habits by
combining **workout planning** and **exercise tracking**. Users can create custom workout plans with splits
and exercises, schedule workouts on specific days of the week,
receive notifications before a session and log each set’s weight and
repetitions. All data is stored in a
PostgreSQL database and synchronized with a backend API.

Version 3 separated the client and server into two distinct
repositories. While previous versions relied on Supabase client
libraries and server-side functions written in Deno, I now use a
dedicated Node.js/Express API for authentication, CRUD operations, and WebSocket support for real-time messaging.

Version 4 builds on top of this by introducing a **smart cache layer**, **offline mode**, **bootstrap API logic**, and **a full UI redesign** - all tailored for high performance and low latency mobile experience.

---

## Screenshots

### App Previews

<div align="center">
  <img src="https://github.com/user-attachments/assets/24a25ef5-a434-49d6-8b8b-1a5b5d808cf9" alt="Home Screen" width="200" style="margin-right: 20px;"/>
  <img src="https://github.com/user-attachments/assets/563ff3b9-58ea-4c8a-a98e-93acdabfd40f" alt="Intro Screen" width="200"/>
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

---

## Main Features

- **Custom workout plans** – Create workout plans containing configurable splits (e.g. push/pull/legs) and assign exercises to each split. Each user can design their own routines. (AI integration in next update).
- **Notifications** – Get a daily push notification.
- **Exercise tracking** – Log sets, repetitions and weight for each exercise. Tracking records are stored with a reference to the underlying split so you can review progress over time.
- **In-app messaging** – Receive system messages at first login and after each successful workout.
- **Authentication & roles** – Secure login with traditional credentials **or OAuth (Google & Apple)**.
- Uses access/refresh tokens with role-based permissions. User accounts include profile information and optional push tokens for notifications.
- **Smart performance** – Heavy screens use `useMemo`, `useCallback` and context providers to avoid unnecessary re-renders. Combined with batched API calls, these optimisations cut perceived navigation latency by **roughly 50 % compared with previous versions.**
- **Modular backend** – All network communication goes through a RESTful API implemented in a separate repository using Node.js and Express.
- **Smart SWR-style cache layer** – A custom-built caching mechanism inspired by SWR, but implemented entirely without libraries. Each data context uses a unified hook (`useCacheAndFetch`) to hydrate from cache, fallback to API if needed, and auto-update in-memory state. Caching logic includes TTL support (planned), safe fallback handling, and background sync.
- **Bootstrap API pattern** – On app launch, a single "bootstrap" call fetches all critical data (user profile, workouts, messages, etc.) to hydrate the app in one go. Greatly reduces network overhead and improves UX during initial load.
- **Offline mode support** – All major screens load from cache when offline. Token refresh happens in background once network returns.
- **Unfinished workout recovery** – If the app closes during an active workout, the session will be restored via cache flush when reopened.
- **User deletion support** – Added the ability to permanently delete an account and all related data from the settings page.
- **Cardio input logging** – Users can now log one cardio session per day (duration), to be expanded with full analytics in future releases.
- **Version-aware cache housekeeping** – When the app updates, outdated cached data is safely cleaned to prevent inconsistency.
- **DPoP Client Proofs (NEW)** – Every API request can include a **DPoP proof** (Demonstration of Proof-of-Possession) signed on-device with an **ES256** key pair.
  - The app **generates and persists** a P-256 key pair on first launch using `jose.generateKeyPair("ES256")`.
  - The **public JWK** is embedded in the JWT header so the backend can verify the signature.
  - This hardens token theft scenarios by requiring possession of the private key to mint valid proofs tied to the exact **method + URL**.
- **Workout Reminders (coming soon)** – personalized daily push notifications based on your workout history and habits, powered by the new backend reminder engine.

---

## Architecture Overview

The project follows a **two-tier architecture**:

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

  - **Security: DPoP proofs** – The client maintains a persistent ES256 key pair (stored as JWKs in SecureStore). A `dpop+jwt` is attached per request with `htm`, `htu`, `iat`, and `jti`, and the public JWK in the protected header, enabling server-side PoP verification.

- **Backend** – a separate Node.js/Express server that exposes
  authenticated endpoints for users, workouts, exercises, messages
  and tracking. It uses PostgreSQL as its primary datastore and
  defines indexes and views to speed up complex queries.
  **[`Backend repository`](https://github.com/kobihanoch/Strong-Together-Backend) for Backend API documentation.**

> **Note:** When upgrading from version 2.x, be aware that all
> Supabase client calls have been removed from the frontend. Instead,
> configure the `API_URL` environment variable to point at your
> running Express server.

## Realtime Messaging (WebSocket)

Version 4.4 introduces a new **secure WebSocket connection** for realtime events (messages, notifications) using **Socket.IO**.

The client first requests a **short-lived connection ticket** from the backend:

```js
// Example flow
const res = await axios.post(`${API_URL}/api/ws/generateticket`);
const { ticket } = res.data;

const socket = io(API_URL, {
  path: "/socket.io",
  transports: ["websocket"],
  auth: { ticket },
});
```

Each ticket is a JWT signed by the backend (`audience: "socket"`, TTL ≈ 90 minutes).
On connection, the server validates the ticket and assigns the socket to a private room matching the user’s ID.

### Behavior

- When the app goes to background → socket disconnects naturally (**ping timeout**).
- When the app returns to foreground → it automatically reconnects;
  if the ticket expired, the app silently fetches a new one and retries.
- All `new_message` events are received via the user’s private room.

### Security benefits

- No permanent session IDs or credentials are sent through the socket.
- Tickets expire quickly and are validated per connection.
- Each user’s socket is fully isolated — no cross-user events possible.

## Tech Stack

The main technologies and libraries used in the frontend and backend include:

| Layer                | Technology                                                                              |
| -------------------- | --------------------------------------------------------------------------------------- |
| **Framework**        | [`React Native`](https://reactnative.dev/) (Expo/CLI)                                   |
| **State management** | React Context + hooks (`useState`, `useReducer`)                                        |
| **Navigation**       | [`React Navigation`](https://reactnavigation.org/)                                      |
| **HTTP client**      | [`axios`](https://axios-http.com/)                                                      |
| **Backend API**      | Node.js + Express (separate repository)                                                 |
| **Cache Layer**      | Server side Redis cache & Custom SWR-inspired logic at client side (`useCacheAndFetch`) |
| **Bootstrap API**    | Unified bootstrap instance                                                              |
| **Offline support**  | Built-in hydration from cache                                                           |
| **Deploying**        | Docker + Render                                                                         |
| **Database**         | Supabase PostgreSQL with indexes & views                                                |

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

The backend uses PostgreSQL as its primary datastore.  
The schema defines tables for **users**, **messages**, **workout plans**, **splits**, **exercises**, **tracking logs**, **workout summaries**, and **user reminder configurations** (`user_split_information`, `user_split_settings`).

The simplified ER diagram below shows how the entities relate to each other:

![Database schema overview](https://github.com/user-attachments/assets/c5223959-3de0-4f5d-a48a-6c8e85ce6c3b)

Important points about the schema:

- **Users** – Stores authentication credentials and profile metadata (`username`, `email`, `role`, `push_token`, etc.).  
  Token versioning (CAS) is used to invalidate all active tokens atomically when needed.

- **WorkoutPlans** – Contain workout programs created by users or trainers.  
  Each plan links to multiple **WorkoutSplits** (e.g., push/pull/legs).

- **WorkoutSplits** – Represent logical divisions within a plan (e.g., “Chest Day”).  
  Each split connects to exercises via the join table `ExerciseToWorkoutSplit`.

- **ExerciseToWorkoutSplit** – Join table mapping exercises to splits, including `order_index`, `num_sets`, and `notes`.  
  This structure defines the *planned* workout layout.

- **ExerciseTracking** – Stores *performed* data: `weight`, `repetitions`, `set_index`, `user_id`, and the associated `ExerciseToWorkoutSplit` reference.  
  Each log is now linked to a **WorkoutSummary** entry (see below).

- **WorkoutSummary** *(NEW)* – Groups all tracking rows from a single session under one `workout_summary_id`.  
  Enables full-session analysis, PR tracking, and session-level metrics (duration, total volume, etc.).

- **User_Split_Information** *(NEW)* – Stores daily computed data per user and split, such as the next workout time, day of week, and UTC time for scheduling reminders.  
  This table is refreshed nightly by the function `refresh_user_split_information()`.

- **User_Split_Settings** *(NEW)* – Stores each user's reminder preferences (e.g., offset minutes before workout, enable/disable reminders).  
  The backend reads from this table hourly to send notifications through the push service.

- **Messages** – Stores system messages and notifications.  
  Each message includes a `subject`, `body`, `sender_id`, `receiver_id`, and `is_read` flag.

> **Optimisations:**  
> All foreign key columns (`user_id`, `workout_id`, `split_id`, `summary_id`) are indexed.  
> SQL **views** and **materialized functions** are used to optimize analytics and daily cron operations.

---

### Workout Flow

![Database workout flow](https://github.com/user-attachments/assets/7a634d62-9c30-4546-b24e-46df64781a6a)

1. **Create a Plan** – The user (or trainer) creates a record in `workoutplans`.  
2. **Add Splits** – Each plan includes one or more entries in `workoutsplits`.  
3. **Assign Exercises** – Exercises are attached to splits via `exercisetoworkoutsplit`.  
4. **Sync Reminder Data** – When a split is added or updated, `refresh_user_split_information()` recalculates reminder info.

---

### Tracking Flow

![Database workout tracking flow](https://github.com/user-attachments/assets/f373dd1e-909a-425d-a1cf-e991550f22cc)

- **Workouts**
  1. **Select a split** – The user opens a `WorkoutSplit` and loads assigned exercises.
  2. **Start Session** – A new `WorkoutSummary` entry is created.
  3. **Record Sets** – Each logged set inserts a new row into `ExerciseTracking`, linked to the current summary.
  4. **Finish Workout** – The summary is updated with session stats (duration, total sets, etc.).
  5. **Review Progress** – The frontend aggregates data by `workout_summary_id` for per-session analytics.

- **Cardio**
  1. **Log daily cardio** – Users can log cardio duration once per day (e.g. walk/run).  
     This will be merged into workout analytics in a future version.

---

### Messages Flow

![Database workout tracking flow](https://github.com/user-attachments/assets/d0e6754a-9123-4443-9fe5-eaecca6885a8)

1. **Compose Message** – System-generated (e.g. after completing a workout).  
2. **Receive & Read** – Users fetch messages via the API; reading marks `is_read = true`.  
3. **Delete** – Messages can be soft-deleted for audit history.

---

### Auth Flow

![Database workout tracking flow](https://github.com/user-attachments/assets/eb0c0c2a-84bc-4409-9b7a-b7019c1ebd27)

1. **User Authentication** – Supports email/password and OAuth (Google, Apple).  
2. **Access & Refresh Tokens** – Issued JWTs may include **DPoP proof binding**.  
3. **Token Versioning (CAS)** – Any logout or password change invalidates all previous tokens.  
4. **DPoP Proofs** – Each protected request includes a signed `dpop+jwt` verifying method, URL, and key binding.  
5. **Push Tokens** – Stored per user to support reminder notifications.

---

### Reminder Flow

![Reminder Flow Diagram Placeholder](https://github.com/user-attachments/assets/39a0c9fb-aba8-4e27-8c6d-2568167e546c)

1. **Data Preparation (Nightly Job)**  
   - The function `refresh_user_split_information()` runs at **02:00 UTC** to compute the next upcoming workouts for each user.  
   - It updates `user_split_information` with the exact UTC times for each split.

2. **Reminder Scheduling (Daily Job)**  
   - Every day, the backend job reads both `user_split_information` and `user_split_settings`.  
   - It calculates which workouts are approaching (based on each user's `reminder_offset_minutes`).  
   - Push messages are queued via the **Expo Push API** for delivery.
   - Push notifications are enqueued with a **delayMs**, for hourly notifications.

3. **Push Delivery**  
   - Notifications are sent directly to the user's device using their saved `push_token`.  
   - Example:  
     _“Kobi, your Push Day workout starts in 30 minutes.”_

---

<!-- Removed the previous diagram to avoid implying a blacklist-based flow -->

### OAuth Integration (Google & Apple)

Version 4.3.0 introduces full **OAuth 2.0 integration** with **Google** and **Apple**, allowing users to sign in securely using their existing accounts.

- **Google Sign-In** – Implemented using `expo-auth-session` with the official Google provider. The app obtains an ID token verified by the backend before linking to an internal user record.
- **Apple Sign-In** – Implemented via `expo-apple-authentication`, generating a secure authorization code and identity token validated server-side.
- Both providers link to the same `users` table via an `oauth_accounts` relation, ensuring one consolidated user profile per email.
- If a user signs in with multiple providers (e.g. Google + Apple), their accounts are automatically merged under the same profile.
- The backend handles token validation, user linking, and fallbacks for missing fields (e.g. name, email) during onboarding.

> 🔐 All OAuth logins fully support the existing **DPoP proof binding** and **token versioning (CAS)** architecture, maintaining the same level of security as traditional credential-based authentication.

1. **Login & Token Issuance** – On successful login, the server issues an `access_token` (short-lived) and a `refresh_token` (long-lived).
2. **Access Control** – Each API request requires a valid `access_token`. If the token is missing, expired, or invalid, the request is denied.
3. **Token Refresh** – When the `access_token` expires, the client uses the `refresh_token` to obtain a new pair of tokens without re-logging in.
4. **Token Versioning (CAS)** – On sensitive events (logout, password change, suspected compromise), the backend **atomically bumps `token_version`** for the user. Any token minted against an older version is rejected, so a single bump invalidates all outstanding tokens without a blacklist.
5. **DPoP Proof Binding** – Each protected request can carry a **DPoP proof** (`dpop+jwt`) signed with the device’s ES256 private key and embedding the public JWK in the header. The backend verifies the signature, validates `htm/htu/iat`, enforces **replay protection** via `jti`, and (where applicable) binds access tokens to the DPoP key.

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
