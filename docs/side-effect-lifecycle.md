# Side-effect lifecycle

Every side effect has one owner. That owner starts it, prevents duplicate work, and cleans it up.

## Ownership

| Owner | Effects | Cleanup or guard |
| --- | --- | --- |
| `App` | Fonts, DPoP key, legacy cleanup | Finish before protected traffic |
| Query provider | Restore and persist API cache | App-version cache buster |
| `AuthProvider` | Restore, token rotation, validation, logout | Single-flight work and session generation |
| Authenticated effects | Timezone, API identity header, socket listeners | Unmount listeners and disconnect |
| Workout store/hook | Draft autosave, rest reminder, submission | Clear on success/discard; retain on failure |
| Video analysis hook | Upload, progress, result listener, tracing | Abort, remove listener, close trace |

## Authenticated runtime

```mermaid
flowchart TD
    Cached[Cached authenticated session] --> Effects[Mount authenticated effects]
    Effects --> Timezone[Detect and sync timezone]
    Effects --> Headers[Set identity header when profile is cached]
    Validated[Session validated] --> Socket[Connect ticketed socket]
    Socket --> Messages[Write messages to Query cache]
    Logout[Logout or identity change] --> Cleanup[Remove listeners and disconnect]
    Cleanup --> Clear[Clear headers and private state]
```

The module-level socket has one authenticated owner. A connection generation prevents a late ticket for an old identity from taking control.

## Workout completion

```mermaid
flowchart TD
    Edit[Edit or complete a set] --> Persist[Persist Zustand draft]
    Persist --> Finish[Finish workout]
    Finish --> Normalize[Remove incomplete work]
    Normalize --> Save[Submit to API]
    Save -->|failure| Keep[Keep draft for retry]
    Save -->|success| Clear[Clear draft and reminder]
    Clear --> Refresh[Invalidate affected Query data]
```

The store persists timestamps instead of ticking counters. Elapsed time stays correct through sleep, background suspension, and restart.

## Video analysis

```mermaid
sequenceDiagram
    participant UI
    participant Hook as Analysis hook
    participant API
    participant Storage
    participant Socket
    UI->>Hook: Analyze video
    Hook->>API: Get upload URL
    Hook->>Storage: Upload with progress
    Hook->>Socket: Wait for job result
    Socket-->>Hook: Result or error
    Hook-->>UI: Show result
    UI->>Hook: Cancel or unmount
    Hook->>Hook: Abort and clean up
```

Analysis output is temporary workflow state, so it stays in the hook instead of Query or Zustand.

## Review rule

For each new effect, answer four questions: who owns it, what starts it, what prevents duplicate work, and what cleans it up.
