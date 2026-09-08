# API, realtime, and AI analysis

## HTTP pipeline

Every feature service uses one Axios instance with a 12-second timeout and shared interceptors.

```mermaid
flowchart LR
    Service --> Request[Request interceptor]
    Request --> Trace[x-request-id + Sentry span]
    Trace --> Version[x-app-version]
    Version --> Security[DPoP proof or key binding]
    Security --> API[Backend]
    API --> Status{Status}
    Status -->|2xx| Data[Typed response]
    Status -->|401| Refresh[Single-flight token rotation]
    Refresh --> Retry[Retry original request once]
    Status -->|426| Upgrade[Required-update modal]
    Status -->|offline/no response| Network[Classified error + notification]
    Status -->|other| Error[Shared error alert]
```

The request ID survives retries, connecting client diagnostics to backend logs. Sentry HTTP spans finish on success and error. Guest requests attach the DPoP public-key thumbprint; authenticated requests attach signed proofs. The app version lets the backend stop clients whose contracts are no longer compatible.

This policy belongs in infrastructure because no feature should be able to accidentally skip authentication, tracing, upgrade handling, or consistent network semantics.

## Socket ownership

```mermaid
sequenceDiagram
    participant Auth as AuthProvider
    participant Effects as AuthenticatedUserEffects
    participant API
    participant Socket
    participant Query as Message query cache
    Auth-->>Effects: validated + current user
    Effects->>API: POST websocket ticket
    API-->>Effects: short-lived ticket
    Effects->>Socket: connect with websocket transport
    Socket-->>Effects: connected
    Effects->>Socket: user_loggedin
    Socket-->>Query: new_message
    Query->>Query: deduplicate ID and prepend
    Socket-->>Effects: auth connect_error
    Effects->>API: mint fresh ticket and reconnect
    Auth-->>Effects: logout/unmount
    Effects->>Socket: remove listeners and disconnect
```

There is one module-level socket and one authenticated owner. `connectionGeneration` increments across connect/disconnect attempts so a ticket returned for an obsolete identity cannot take ownership. A connection is reused only for the same user. Reconnection uses bounded backoff and refreshes the short-lived ticket when the server reports missing, invalid, expired, or unauthorized authentication.

Realtime events update existing state owners. Messages enter the TanStack message cache; video results stay in the active analysis hook because they are transient workflow output.

## AI video pipeline

```mermaid
sequenceDiagram
    participant UI as Analysis sheet
    participant Hook as useVideoAnalysis
    participant API
    participant Storage as Object storage
    participant Worker
    participant Socket
    UI->>Hook: Analyze selected video
    Hook->>Hook: Create job ID + start Sentry trace
    Hook->>API: Request presigned upload URL
    API-->>Hook: Upload URL
    Hook->>Storage: Direct upload with progress + AbortSignal
    Hook->>Socket: Register result listener
    Storage-->>Worker: Queued analysis input
    Worker-->>Socket: video_analysis_results
    Socket-->>Hook: success or backend error
    Hook-->>UI: Render repetition analysis
    Hook->>Hook: Remove listener and close span
```

The UI owns media selection, trim/compression constraints, and supported-exercise checks. The hook owns in-flight exclusion, phases, progress, cancellation, listener cleanup, and observability. A ref mirrors the current phase so asynchronous error handling reports upload and analysis failures accurately.

Direct-to-storage upload keeps large media off the API process and gives the client native progress/cancellation. The backend still authorizes the upload and correlates work through job/request IDs. Socket delivery fits a result whose processing time outlives the initiating HTTP request.

Related files: `infrastructure/api/`, `infrastructure/socket.ts`, `features/messages/`, and `screens/workout-session/hooks/use-video-analysis.hook.ts`.
