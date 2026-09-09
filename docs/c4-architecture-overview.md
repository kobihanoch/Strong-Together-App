# Architecture overview

## System context

```mermaid
flowchart TD
    Athlete([Athlete]) --> App[Mobile app]
    App <-->|HTTPS and ticketed realtime| Backend[Strong Together API]
    App -->|OAuth| Identity[Apple and Google]
    App -->|Presigned video upload| Storage[(Object storage)]
    Backend --> Data[Database, push, and analysis worker]
```

The mobile client never accesses the application database directly. The backend owns authorization, durable domain data, websocket tickets, upload authorization, and job orchestration. Object storage receives large video bytes directly after the API authorizes a short-lived upload.

## Containers inside the device

```mermaid
flowchart LR
    UI[UI and navigation] --> State[Auth, Query, Zustand]
    State --> IO[Axios and Socket.IO]
    IO --> Backend[Backend]
    State <--> Storage[SecureStore and AsyncStorage]
```

The storage mechanisms have separate responsibilities; see [Zustand and storage](zustand-and-storage.md).

## Component ownership

| Component                    | Owns                                                             | Does not own                  |
| ---------------------------- | ---------------------------------------------------------------- | ----------------------------- |
| `App`                        | Boot prerequisites and provider order                            | Domain workflows              |
| `AuthProvider`               | Session phases, validation, login completion, logout             | User profile and feature data |
| `PersistQueryClientProvider` | Remote-state hydration/persistence                               | Authentication decisions      |
| `AuthenticatedUserEffects`   | Timezone sync, username header, socket lifecycle/listeners       | UI or navigation              |
| Feature Query hooks          | Remote state, mutations, invalidation, domain helpers            | Credential persistence        |
| Zustand stores               | Durable device-owned state                                       | Server data                   |
| Screen hooks                 | View models and orchestration                                    | Cross-app transport policy    |
| Axios infrastructure         | DPoP, request IDs, version header, refresh, error classification | Presentation state            |

## End-to-end application flow

```mermaid
flowchart TD
    Launch --> Boot[Prepare app and restore caches]
    Boot --> Session{Stored session?}
    Session -->|no| Guest[Authentication screens]
    Session -->|yes| Validate[Validate and rotate token]
    Validate -->|valid| Online[Enable queries and socket]
    Validate -->|temporary failure| Offline[Show cache; pause private network]
    Validate -->|invalid| Guest
    Offline -->|online again| Validate
    Guest -->|login or OAuth| Online
    Online --> App[Home and feature screens]
```

Related detail: [frontend ownership](frontend-architecture.md), [startup](app-rendering-flow.md), [authentication](auth-context-flow.md), and [API/realtime](api-realtime-ai-flow.md).
