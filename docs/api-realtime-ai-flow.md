# API, Realtime, and AI Analysis Flow

## Table of Contents

1. [API Client](#api-client)
2. [DPoP and Headers](#dpop-and-headers)
3. [Response Handling](#response-handling)
4. [Realtime Events](#realtime-events)
5. [AI Video Analysis](#ai-video-analysis)
6. [Related Files](#related-files)

## API Client

The Axios client is configured with layered interceptors for **bootstrap**, **headers**, **DPoP**, **Sentry tracing**, **refresh-on-401**, network handling, and update-required handling.

The bootstrap interceptor runs first so known startup requests can be served from a single bootstrap payload when possible.

## DPoP and Headers

Each outgoing request receives:

- `x-request-id` for request correlation and retry continuity
- `x-app-version` for backend release compatibility checks
- `dpop-key-binding` for guest auth/token-binding requests
- `dpop` proof for authenticated requests

The app creates the DPoP key pair during startup before the authenticated app renders.

## Response Handling

The response interceptor handles important production cases:

- `426` opens the update-required modal.
- Offline or server-down states are marked on the Axios error and surfaced through user notifications.
- `401` attempts refresh-token rotation once, updates the access token, and retries the original request.
- Failed auth refresh logs the user out through `GlobalAuth.logout`.
- Other server errors use the shared error-alert helper.

## Realtime Events

The websocket flow uses short-lived tickets:

1. The app asks the API for a websocket ticket.
2. Socket.IO connects with the ticket in `auth`.
3. The socket emits `user_loggedin` on connect.
4. Auth-related connection errors trigger ticket refresh and reconnect.
5. Logout removes listeners, disconnects, and clears the socket instance.

Messages register a listener that appends new messages into provider state. AI analysis registers a separate listener for analysis results.

## AI Video Analysis

The workout analysis flow is asynchronous:

1. The user opens the analysis sheet from a workout session.
2. The UI validates exercise support, media permission, file size, duration, trim, and compression.
3. The client creates a job id and requests a presigned upload URL.
4. The video uploads to storage with progress updates and abort support.
5. The app waits for websocket results while the backend processes the job.
6. Sentry spans trace the full pipeline from upload through result receipt.
7. Results render in the analysis sheet; backend failures are shown through `showErrorAlert`.

The first supported analysis target is **squat**, keeping the UX focused while the pipeline is proven end to end.

## Related Files

- `infrastructure/api/api-config/api.interceptor.ts`
- `infrastructure/api/api-config/helpers/header-injections.ts`
- `infrastructure/api/api-config/helpers/error-handlers.ts`
- `infrastructure/api/dpop/*`
- `infrastructure/socket.ts`
- `features/messages/messages.listeners.ts`
- `features/workouts/session/hooks/use-video-analysis.hook.ts`
- `features/workouts/session/components/AnalyzeExerciseSheet.tsx`
- `features/workouts/session/video-analysis.listeners.ts`
