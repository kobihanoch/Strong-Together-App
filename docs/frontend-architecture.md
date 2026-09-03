# Refactored frontend architecture

This document maps the screens that currently follow the refactored `screen -> screen logic hook -> feature hook -> TanStack Query` structure. Auth, Intro, Settings, Analytics, and Start Workout are outside this dependency map because they do not yet follow that structure end to end. Start Workout is shown only as a navigation destination.

For the system context, containers, provider lifecycle, socket sequence, and complete application flow, see [C4 architecture and application flow](./c4-architecture-overview.md).

## Main screen flow

```mermaid
flowchart LR
  Home[Home]
  Plan[My Workout Plan]
  Editor[Create / Edit Workout]
  Start[Start Workout<br/>not yet refactored]
  History[Track History]
  Profile[Profile]
  Inbox[Inbox]

  Home -->|bottom navigation| Plan
  Home -->|bottom navigation| History
  Home -->|bottom navigation| Profile
  Home -->|unread messages| Inbox
  Home -->|no plan / create plan| Editor
  Home -->|next workout| Start
  Plan -->|create or edit| Editor
  Plan -->|start selected split| Start
  Start -->|workout saved| History
  History -->|view plan| Plan

  classDef external fill:#f5f5f5,stroke:#888,stroke-dasharray:5 5,color:#555;
  class Start external;
```

The persistent bottom navigation connects `Home`, `MyWorkoutPlan`, `TrackHistory`, and `Profile` in both directions. The arrows above emphasize the main task flow rather than repeating every tab-to-tab combination.

## Screen-to-data dependency map

```mermaid
flowchart LR
  subgraph Screens
    SHome[Home]
    SPlan[MyWorkoutPlan]
    SHistory[TrackHistory]
    SEditor[CreateWorkout]
    SProfile[Profile]
    SInbox[Inbox]
  end

  subgraph Screen_logic_hooks[Screen logic hooks]
    LHome[useHomeDashboard<br/><small>use-home.hook.ts</small>]
    LPlan[useMyWorkoutPlan]
    LHistory[useTrackHistory]
    LEditor[useEditWorkoutPlan]
    LProfile[useProfilePageLogic]
    LInbox[useInboxLogic]
  end

  subgraph Feature_hooks[Feature hooks]
    FUser[useUser]
    FMessages[useMessages]
    FPlan[useWorkoutPlan]
    FExercises[useExercises]
    FCardio[useCardio]
    FDashboard[useDashboard]
    FWorkoutHistory[useWorkoutHistory]
    FExerciseHistory[useExerciseHistory]
    FPrHistory[usePrHistory]
  end

  subgraph TanStack_keys[TanStack query keys]
    KUser["['user', userId]"]
    KMessages["['messages', userId]"]
    KPlan["['workout-plan', userId]"]
    KExercises["['exercises', userId]"]
    KCardio["['cardio-maps', userId]"]
    KDashboard["['home-dashboard', userId]"]
    KWorkoutHistory["['workout-history', userId]"]
    KExerciseHistory["['exercise-history', userId]"]
    KPrHistory["['pr-history', userId]"]
  end

  SHome --> LHome
  SPlan --> LPlan
  SHistory --> LHistory
  SEditor --> LEditor
  SProfile --> LProfile
  SInbox --> LInbox

  LHome --> FUser
  LHome --> FMessages
  LHome --> FPlan
  LHome --> FCardio
  LHome --> FDashboard

  LPlan --> FPlan
  LPlan --> FWorkoutHistory
  LPlan --> FExerciseHistory
  LPlan --> FDashboard

  LHistory --> FWorkoutHistory
  LHistory --> FExerciseHistory
  LHistory --> FPrHistory
  LHistory --> FPlan
  LHistory --> FCardio

  LEditor --> FPlan
  LEditor --> FExercises
  LProfile --> FUser
  LInbox -->|via MessagesProvider| FMessages

  FUser --> KUser
  FMessages --> KMessages
  FPlan --> KPlan
  FExercises --> KExercises
  FCardio --> KCardio
  FDashboard --> KDashboard
  FWorkoutHistory --> KWorkoutHistory
  FExerciseHistory --> KExerciseHistory
  FPrHistory --> KPrHistory
```

## Dependency inventory

| Screen | Screen logic hook | Consumed feature hooks and TanStack query keys |
| --- | --- | --- |
| `Home` | `useHomeDashboard` | `useUser` -> `['user', userId]`; `useMessages` -> `['messages', userId]`; `useWorkoutPlan` -> `['workout-plan', userId]`; `useCardio` -> `['cardio-maps', userId]`; `useDashboard` -> `['home-dashboard', userId]` |
| `MyWorkoutPlan` | `useMyWorkoutPlan` | `useWorkoutPlan` -> `['workout-plan', userId]`; `useWorkoutHistory` -> `['workout-history', userId]`; `useExerciseHistory` -> `['exercise-history', userId]`; `useDashboard` -> `['home-dashboard', userId]` |
| `TrackHistory` | `useTrackHistory` | `useWorkoutHistory` -> `['workout-history', userId]`; `useExerciseHistory` -> `['exercise-history', userId]`; `usePrHistory` -> `['pr-history', userId]`; `useWorkoutPlan` -> `['workout-plan', userId]`; `useCardio` -> `['cardio-maps', userId]` |
| `CreateWorkout` | `useEditWorkoutPlan` | `useWorkoutPlan` -> `['workout-plan', userId]`; `useExercises` -> `['exercises', userId]` |
| `Profile` | `useProfilePageLogic` | `useUser` -> `['user', userId]` |
| `Inbox` | `useInboxLogic` | `useMessages` (through `MessagesProvider`) -> `['messages', userId]` |

All keys are query keys. The feature mutations currently do not declare `mutationKey`; on success, they update the associated query cache using the key shown above.

## Layer responsibilities

- **Screen:** renders UI and forwards user events.
- **Screen logic hook:** combines feature data, derives presentation state, owns screen-local state, and exposes screen actions.
- **Feature hook:** owns server operations, TanStack loading state, and cache updates for one domain.
- **TanStack Query cache:** stores authenticated server state, partitioned by `userId`.
