# Workout Schedule — UX and API Contract

Implementation brief for the AI agent. This feature is part of **Plan**, not Profile. Notification deep-link behavior is out of scope.

## Product rules

- No schedule is the default. No database schedule records exist until the user saves at least one day.
- A workout plan can be used without a schedule.
- A schedule repeats weekly and supports one workout split per weekday.
- Day is required for a scheduled workout; time is optional.
- A workout without a time appears on Home but cannot have a reminder.
- Reminder controls are enabled only when phone notification permission is allowed.
- Turning off/revoking notifications keeps the schedule and times but stops reminders.
- The schedule guides the user; it never prevents starting another workout.
- The user's timezone is already synchronized elsewhere. Use that server-side timezone when calculating reminders.

## Navigation and entry points

Do not add a bottom-navigation tab. Add `WorkoutSchedule` as a stack screen under the existing **Plan** experience.

### 1. Plan tab — primary entry

When a workout plan exists, show a compact **Schedule** action in the Workout Plan header. It is always available and opens the schedule editor.

![Plan entry](assets/workout-schedule-ux/01-plan-entry.png)

When no workout plan exists, do not show an active Schedule action. The existing Create workout plan experience remains primary.

### 2. Immediately after plan creation

After a plan is created successfully, show the one-time optional invitation:

- **Schedule my week** opens the editor.
- **Not now** returns to Plan.
- Neither action creates schedule records. Records are created only by Save schedule.

![Plan-created invitation](assets/workout-schedule-ux/02-plan-created-invitation.png)

### 3. Home when no schedule exists

Keep the existing Next Workout card. Add a small dismissible scheduling card beneath it.

- **Set schedule** opens the editor.
- Dismissal can be stored locally and must not create server data.
- Starting a workout remains fully available.

![Home without schedule](assets/workout-schedule-ux/03-home-no-schedule.png)

### 4. Home when a workout is scheduled today

The main hero becomes **Today's workout** and shows workout name, time or **Any time today**, and reminder text when applicable.

- **Start workout** starts the assigned split, including before its scheduled time.
- **Reschedule** opens the editor focused on today.
- **Manage** on the weekly summary opens the editor.
- After completion, show the completed state and cancel any remaining reminder for that occurrence.

![Scheduled workout today](assets/workout-schedule-ux/04-home-workout-today.png)

### 5. Home when today has no workout

Show a positive **Rest day** state, the next scheduled workout, **View schedule**, and **Start a workout**. Do not use warning, late, or failure styling.

![Home rest day](assets/workout-schedule-ux/05-home-rest-day.png)

## Schedule editor

Use a full stack screen with a back button. Hide the bottom tab bar on this editor.

![Schedule editor](assets/workout-schedule-ux/06-schedule-editor.png)

Each weekday row supports:

- A workout split from the current workout plan, or Rest day.
- An optional local time in `HH:mm`.
- Clear/change actions.

The workout selector is a bottom sheet listing existing splits and Rest day. Do not create or edit workout plans inside it.

### Reminder behavior

- Show reminder settings only for scheduled workouts with a time.
- Use a shared default offset for MVP: At time, 5, 10, 15, or 30 minutes; 1 hour; or 1 day before.
- If permission is allowed, reminder controls are enabled.
- If permission is unanswered, show **Enable notifications**; tapping it requests permission.
- If permission was denied, disable the controls and show **Open settings**.
- Never request permission merely by opening the editor.
- The app-init permission flow remains responsible for prompting once while status is `undetermined`.

### Saving

- Save is disabled when nothing changed, nothing is scheduled, or a request is pending.
- Save atomically replaces the recurring weekly schedule.
- On success, refresh schedule/Home queries, return to the previous screen, and show the existing success toast.
- On error, keep the draft and show the existing error toast.
- Back/Cancel closes immediately when unchanged; otherwise confirm discarding the draft.
- **Clear schedule** requires confirmation and deletes the entire schedule. After deletion, Home returns to the no-schedule state.

## Home-state priority

Render one primary Home state in this order:

1. Active/incomplete workout session — preserve existing session behavior.
2. Scheduled workout today — Today's workout.
3. Schedule exists but today is empty — Rest day and next scheduled workout.
4. Workout plan exists but schedule does not — current Next Workout plus optional Set schedule card.
5. No workout plan — current Create workout plan state.

## Required API contracts

These can be added to `@strong-together/shared`. Names may follow server conventions, but semantics should remain the same.

### Types

```ts
type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

type WorkoutScheduleEntry = {
  id: string;
  weekday: Weekday;
  workoutSplitId: number;
  localTime: string | null; // HH:mm in the user's synchronized timezone
};

type WorkoutSchedule = {
  id: string;
  reminderOffsetMinutes: number | null;
  timeZone: string; // effective server-side IANA timezone
  entries: WorkoutScheduleEntry[];
  updatedAt: string;
};
```

### Get schedule

```http
GET /api/workout-schedule
```

```ts
type GetWorkoutScheduleResponse = {
  workoutSchedule: WorkoutSchedule | null;
};
```

`null` means the user has never scheduled or has cleared the schedule. It is not an error.

### Create or replace schedule

```http
PUT /api/workout-schedule
```

```ts
type ReplaceWorkoutScheduleBody = {
  reminderOffsetMinutes: number | null;
  entries: Array<{
    weekday: Weekday;
    workoutSplitId: number;
    localTime: string | null;
  }>;
};

type ReplaceWorkoutScheduleResponse = {
  workoutSchedule: WorkoutSchedule;
};
```

Server validation:

- `entries` must contain 1–7 unique weekdays.
- Every `workoutSplitId` must belong to the authenticated user's current plan.
- `localTime` must be `HH:mm` or `null`.
- `reminderOffsetMinutes` must be one supported value or `null`.
- A non-null reminder offset does not guarantee delivery; the server must also have an enabled device token.
- Replace all entries in one transaction so partial weekly schedules are never observed.

Expected errors: `400` invalid data, `401` unauthenticated, `404` workout plan/split missing, `409` plan changed while editing.

### Delete schedule

```http
DELETE /api/workout-schedule
```

Return `204`. Deleting an absent schedule should also succeed. Cancel all pending future reminders for it.

### Device notification capability

The existing `PUT /api/users/me/push-token` registers a token, but server reminders also need a way to stop delivery when permission is revoked.

Recommended replacement/addition:

```http
PUT /api/users/me/devices/{installationId}/push
```

```ts
type UpsertPushDeviceBody = {
  expoPushToken: string | null;
  notificationsAllowed: boolean;
  platform: 'ios' | 'android';
};
```

Call it after permission checks on authenticated app start/foreground and whenever permission changes. The server sends a workout reminder only when the schedule entry has a time, an offset exists, and at least one registered device is allowed.

If reminders are implemented entirely as local notifications, this device endpoint change is not required; the client must instead persist notification identifiers and cancel/reschedule them after every schedule, timezone, or permission change.

### Home data

No new Home endpoint is required. The client can derive today's and next scheduled workout from `GET /api/workout-schedule`, the existing workout-plan query, current local date, and workout history. If the backend already aggregates Home data, it may optionally return the same derived state to avoid another request.

## Frontend implementation boundaries

- Add `WorkoutSchedule` to `RootParamList`.
- Create schedule types/service/query hook under `features/workouts/schedule`.
- Use a TanStack Query key scoped to the authenticated user.
- Invalidate `workout-schedule` and `home-dashboard` after replace/delete.
- Reuse theme tokens, shared buttons, notifier helpers, and current workout-split types.
- Keep permission reading in one shared notification hook; do not duplicate OS permission state in schedule components.
- Add tests for navigation entry points, null schedule, optional time, permission gating, save/delete, and every Home state priority.

## Acceptance criteria

- No records are created until Save schedule succeeds with at least one entry.
- Schedule is accessible from Plan, the post-create invitation, and relevant Home cards.
- No schedule entry exists in Profile and no notification deep-link flow is added.
- A time is optional; a reminder without a time is impossible.
- Revoked/denied permission disables reminders without deleting the schedule.
- Today's scheduled workout replaces the normal Home hero; an empty day shows Rest day and the next workout.
- Users can always start a workout outside the schedule.
- Clearing the final schedule deletes it and restores the no-schedule Home state.
