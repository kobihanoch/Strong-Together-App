# Architecture overview

## System context

```mermaid
flowchart LR
    Athlete([Athlete]) --> App[Strong Together<br/>React Native app]
    App -->|HTTPS + DPoP| Backend[Strong Together API]
    App <-->|Ticketed Socket.IO| Backend
    App -->|OAuth| Identity[Apple / Google]
    App -->|Presigned upload| Storage[(Object storage)]
    Backend --> DB[(Database)]
    Backend --> Push[Push notification service]
    Push --> App
    Backend --> Worker[Video analysis worker]
    Worker -->|Realtime result| App
```

The mobile client never accesses the application database directly. The backend owns authorization, durable domain data, websocket tickets, upload authorization, and job orchestration. Object storage receives large video bytes directly after the API authorizes a short-lived upload.

## Containers inside the device

```mermaid
flowchart TB
    subgraph Device[Mobile device]
        UI[React Native UI + navigation]
        Auth[AuthProvider]
        Query[TanStack Query]
        Stores[Zustand stores]
        HTTP[Axios + interceptors]
        Socket[Socket.IO client]
        Secure[(SecureStore)]
        Async[(AsyncStorage)]
    end
    UI --> Auth
    UI --> Query
    UI --> Stores
    Query --> HTTP
    Auth --> HTTP
    Auth --> Socket
    Auth <--> Secure
    HTTP --> Secure
    Query <--> Async
    Stores <--> Async
    HTTP --> API[Backend API]
    Socket <--> Realtime[Socket.IO server]
```

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
    Launch --> Boot[Polyfills, fonts, DPoP key, legacy cleanup]
    Boot --> Hydrate[Restore Query cache]
    Hydrate --> Check[Restore SecureStore identity]
    Check -->|missing| Guest[Intro / Login / Register]
    Check -->|present| Cached[Render authenticated tree from cache]
    Guest -->|login or OAuth| Validated[Validated session]
    Cached --> Refresh[Refresh and rotate credentials]
    Refresh -->|valid| Validated
    Refresh -->|offline/server/upgrade| Offline[Keep cached UI; gate network/socket]
    Refresh -->|invalid| Guest
    Offline -->|connectivity returns| Refresh
    Validated --> Features[Enable feature queries + socket]
    Features --> Home
    Home --> Plan[Plan / Editor]
    Home --> Session[Resumable workout]
    Session --> Summary
    Summary --> History
    Home --> History
    Home --> Schedule[Schedules / reminders]
    Home --> Inbox
    Home --> Profile
```

Related detail: [frontend ownership](frontend-architecture.md), [startup](app-rendering-flow.md), [authentication](auth-context-flow.md), and [API/realtime](api-realtime-ai-flow.md).
