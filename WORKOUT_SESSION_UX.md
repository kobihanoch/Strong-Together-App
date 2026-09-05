# Workout Session UX/UI

This document is the source of truth for the active Workout Session experience. The product has three primary concepts: **log the current set, navigate the workout freely, and finish the workout**. Everything else is a secondary action.

The approved visual direction is a strong dark contextual header over a clean white workspace. Existing application patterns from CreateWorkout, TrackHistory, and the global Error/Info notification system must be reused instead of creating parallel experiences.

## UX Philosophy and Design Principles

- Optimize for fast, low-attention use in a gym.
- Display one exercise at a time; never turn the main screen into a list of exercise cards.
- Persist entered values immediately and require a separate explicit action to mark work complete.
- Treat plan order as organization, not mandatory execution order.
- Keep secondary tools behind the exercise menu or Exercise Navigator.
- Prefer the visible state change itself as feedback. A checked set, inserted exercise, `EXTRA` set, or changed exercise needs no notification.
- Use the existing top Error/Info notification only when feedback is genuinely necessary.
- Do not show the application's bottom navigation while a workout is active.

## Main Screen Structure and Visual Hierarchy

The active workout screen has three primary regions:

1. A dark contextual header with Back, Finish, compact workout progress, previous/next exercise arrows, a tappable exercise name, current set, and previous performance.
2. A light logging workspace with the Set Navigator, large weight/reps editors, and a compact `Done` action.
3. A compact elapsed-rest control near the bottom of the workout screen when rest tracking is active.

The exercise name includes a dropdown indicator and opens the Exercise Navigator. There is no application tab bar or bottom navigation within the active workout.

## Active Exercise and Active Set

**Purpose:** Keep one logging task prominent while allowing unrestricted movement through the workout.

**User interaction:** Tap the previous/next arrows, exercise title, an Exercise Navigator row, or a set in the Set Navigator.

**UI behavior:** Only the selected exercise and set are shown. The dark header identifies the exercise, `Set n of m`, previous performance for useful context, and overall completed/total-set progress.

**State transitions:** Selecting another exercise or set changes only the visible editing context. It never completes work or clears values. The active exercise and set are persisted for exact restoration.

**Edge cases:** Completed exercises and sets remain selectable. If matching history does not exist, show a quiet empty state such as `No previous performance`.

## Set Navigator

**Purpose:** Show set status and permit direct set selection in minimal space.

**User interaction:** Tap any set number to select it. Tap `+` to append a set.

**UI behavior:** A check identifies a completed set, a filled indicator identifies the active set, and a plain number identifies an unfinished set. Additional sets follow normal numbering and carry a subtle `EXTRA` label.

**State transitions:** Adding a set immediately creates and persists a new unfinished tracked set with a stable `setIndex`. Selecting a set preserves every other set's values and status.

**Edge cases:** The navigator scrolls horizontally when needed. Set identity is based on its stable index/identifier, not transient array position. An extra set immediately contributes to the workout progress denominator.

## Weight and Reps Editing

**Purpose:** Make the most common workout interaction immediate and readable.

**User interaction:** Use large minus/plus controls or tap the value for numeric keyboard entry.

**UI behavior:** Weight and reps are the dominant values on the screen. Touch targets remain suitable for use during training.

**State transitions:** Every valid change updates and persists the workout draft immediately. Persistence is independent of `Done`.

**Edge cases:** Invalid, negative, or unsupported values are rejected or normalized. Partially entered input survives exercise changes, sheets, backgrounding, and process restarts. Editing a completed set does not silently reopen it.

## Set Completion

**Purpose:** Distinguish recording values from confirming that the physical set was performed.

**User interaction:** Tap the compact explicit `Done` action.

**UI behavior:** `Done` does not save the values; they are already persisted. It only marks the selected set complete, updates progress, selects the next unfinished set, and begins elapsed rest tracking at `00:00`.

**State transitions:** `unfinished → completed`. The next unfinished set in the same exercise is preferred. If none remains, the user stays free to choose any exercise.

**Edge cases:** Entering weight/reps never completes a set. Repeated completion attempts are idempotent. Missing required values use inline validation rather than a toast.

## Extra Sets

**Purpose:** Support work beyond the planned prescription.

**User interaction:** Tap `+` in the Set Navigator.

**UI behavior:** The new set appears inline with a restrained `EXTRA` marker and uses the standard editing and completion behavior. No success notification is shown.

**State transitions:** The new unfinished set is persisted immediately and contributes to total progress. Only explicitly completed extra sets are submitted as performed work.

**Edge cases:** Removing an extra set with entered or completed data requires destructive confirmation. Removal must never shift data onto another set.

## Exercise Navigator

**Purpose:** Provide a compact workout overview and direct access to every exercise.

**User interaction:** Tap the exercise title, then select any exercise, choose `Edit order`, or choose `+ Add exercise`.

**UI behavior:** The navigator is a bottom sheet. Each row shows order, exercise name, completed/total sets, current/completed state, and `ADDED` where applicable. Selecting a row closes the sheet and opens that exercise.

**State transitions:** Jumping changes only the active exercise. Rest tracking, inputs, notes, completion, and analysis state remain unchanged.

**Edge cases:** The active row is clearly identified, completed exercises remain accessible, and long names do not obscure progress.

## Non-Linear Workout Flow

Exercise order is display order, not execution order. The user can freely:

- Move to the previous or next exercise.
- Jump to any exercise through the Exercise Navigator.
- Select any completed or unfinished set.
- Leave unfinished input and return later.
- Reorder exercises without moving or rewriting their associated data.
- Add an exercise or extra set at any point.

Unfinished inputs survive every navigation action. Overall progress derives from explicit set completion. The elapsed rest measurement is global and independent of the exercise currently visible.

## Exercise Reordering

**Purpose:** Adapt the workout to equipment availability without changing its content.

**User interaction:** In the Exercise Navigator, tap `Edit order`, drag rows using visible handles, then tap `Done` to leave reorder mode.

**UI behavior:** Drag handles appear only in the dedicated reorder mode. Progress and `ADDED` identity remain visible during reordering.

**State transitions:** Only display order changes and is persisted.

**Edge cases:** Exercise identity, sets, values, notes, completion, history association, and analysis state stay attached to the same exercise. The current exercise remains active after it moves.

## Adding Spontaneous Exercises

**Purpose:** Record unplanned exercises without modifying the underlying workout plan.

**User interaction:** Choose `+ Add exercise` in the Exercise Navigator and select an exercise using the existing CreateWorkout exercise picker.

**UI behavior:** Reuse the CreateWorkout picker component and its current search, filtering, list-row, selected/added, and modal behavior. Do not create a Workout Session-specific library design. The inserted exercise carries `ADDED` and appears in the navigator and progress immediately. The insertion itself is sufficient feedback.

**State transitions:** The draft receives a spontaneous entry using `exerciseId`, not `exerciseToSplitId`. The saved workout plan is unchanged.

**Edge cases:** Only spontaneous exercises expose removal. Removing one with entered or completed data requires confirmation. Duplicate handling follows the reused picker behavior unless the workout data contract requires stricter validation.

## `ADDED` and `EXTRA` Semantics

`ADDED` means an exercise was introduced during this workout and is not part of the selected split. `EXTRA` means a set exceeds that exercise's planned set count. Both are informational, visually restrained, fully editable, and included in workout progress.

## Global Elapsed Rest Tracking

**Purpose:** Measure actual rest without prescribing or counting down a duration.

**User interaction:** Completing a set starts rest automatically. Tap `Finish Rest` to end the measurement.

**UI behavior:** A compact persistent workout control reads, for example, `REST · Bench Press 00:42` with `Finish Rest`. It counts upward from `00:00`, identifies the set/exercise that started it, and remains visible across exercise and set navigation. There is no configured duration, countdown, completion alert, or Skip action.

**State transitions:**

- `Done`: start elapsed rest for the newly completed set.
- Another set completed while resting: immediately replace the previous measurement and restart at `00:00` for the new set, without confirmation.
- `Finish Rest`: clear the active rest measurement.

**Edge cases:** Persist the start timestamp and source identity, not a per-second counter. Derive elapsed time from the current clock so it remains accurate while backgrounded or terminated. Rest can belong to a different exercise than the one currently visible.

## Exercise Menu and Secondary Actions

**Purpose:** Keep the logging screen focused while exposing contextual tools.

**User interaction:** Tap the exercise menu (`•••`).

**UI behavior:** The menu includes Exercise History, Add/Edit Note, Analyze Video only when supported, and Remove Exercise only for `ADDED` exercises. It does not include rest-duration configuration or a separate previous-workout/autofill action.

**State transitions:** Opening or closing the menu changes no workout data.

**Edge cases:** Unsupported Video Analysis is omitted rather than shown disabled. Destructive removal is visually separated.

## Exercise History and Fill Values

**Purpose:** Make performance context and value reuse available through one coherent feature.

**User interaction:** Open Exercise History, use the existing TrackHistory chart, select a workout/data point, inspect that workout's sets, and tap `Fill values`.

**UI behavior:** Reuse the existing TrackHistory chart and its visual/selection behavior rather than designing a new graph. The selected point reveals its workout and set data. Recent performances show dates, set-level weight/reps, comparisons, and restrained PR markers. `Fill values` is available in the selected-workout context.

**State transitions:** Browsing is read-only. `Fill values` copies matching values into eligible draft sets and persists them immediately; completion flags never change. Returning to the main screen visibly shows the filled values. There is no separate Autofill flow and no Undo notification.

**Edge cases:** Do not overwrite completed sets. If set counts differ, fill only valid matching sets. Empty history and loading/error states stay contained within History and never block logging. Estimated 1RM is never shown.

## PR Presentation and Progress Graph

**Purpose:** Show meaningful progress using the product's established history language.

**User interaction:** Select points and inspect sessions within Exercise History.

**UI behavior:** Use the existing TrackHistory Max Weight chart, labels, selection behavior, comparisons, and PR presentation. Do not introduce a second chart system or invented metrics.

**State transitions:** Chart exploration is read-only until `Fill values` is explicitly selected.

**Edge cases:** Sparse data follows TrackHistory's existing empty/sparse behavior. Estimated 1RM remains excluded.

## Notes

**Purpose:** Store exercise-specific observations without adding permanent clutter to the logging screen.

**User interaction:** Open Add/Edit Note from the exercise menu, edit the text, and save or cancel.

**UI behavior:** Use one focused note editor. The main screen may show a subtle existing-note indicator.

**State transitions:** Save persists the note to the draft; cancel preserves the previous value.

**Edge cases:** Support deletion and reasonable length validation without losing text unexpectedly.

## Video Analysis Flow

**Purpose:** Offer optional form analysis for supported exercises without interrupting the workout.

**User interaction:** Choose Analyze Video, upload a video, trim it, submit it for processing, continue the workout, and view the result when ready.

**UI behavior:** The only flow is `Upload video → Trim → Process → Result`; Record Video is not offered. Processing does not block the Workout Session, and active elapsed rest continues. Readiness or failure uses the application's existing top Info/Error notification when notification is necessary.

Results must be designed from the real Analysis API contract:

- Per-repetition depth: value, status, and confidence.
- Per-repetition back lean: value, excessive flag, and confidence.
- Audit data: frames analyzed, valid frames, camera angle, raw bottom angle, and sampling rate.
- Job failure: the API-provided error.

Do not invent an overall score, coaching verdict, symmetry metric, tempo metric, or any other unsupported analysis value.

**State transitions:** `idle → selecting upload → trimming → uploading/processing → completed or failed → viewing result`. Results remain associated with their source exercise.

**Edge cases:** Unsupported exercises omit the action. Upload/processing failures are retryable and never alter workout data. Switching exercises, resting, backgrounding, or finishing must not corrupt an in-flight analysis.

## Feedback and Notifications

**Purpose:** Reserve explicit messaging for information the interface cannot communicate by itself.

**User interaction:** No action is required for ordinary state changes. When an actionable error or important information occurs, the user interacts with the application's existing top Error/Info notification.

**UI behavior:** Do not add Workout Session-specific floating toasts or snackbars. Switching exercises, completing a set, adding an exercise, adding an extra set, filling values, and reordering are reflected directly in the UI and do not receive redundant messages.

**State transitions:** Notifications do not own workout state. Dismissal never changes or removes draft data.

**Edge cases:** Inline validation is preferred for field-specific problems. Submission and analysis failures use the global system because they require attention or retry.

## Persisting and Resuming a Workout

**Purpose:** Restore an interrupted active workout without creating a large leave/resume feature.

**User interaction:** During application bootstrap, if a persisted active workout exists, the user sees one simple Resume Workout state and taps `Continue`.

**UI behavior:** The resume state provides concise workout identity and progress. `Continue` opens the Workout Session at the exact last active exercise and set with all persisted values, completion, order, additions, notes, and rest state restored. Do not create app-wide resume banners or a multi-screen leave flow for this feature.

**State transitions:** `bootstrap hydration → resume prompt → active workout`. The app must finish hydration before deciding whether a resumable workout exists.

**Edge cases:** Elapsed workout/rest values are derived from persisted timestamps. Invalid or incompatible draft data follows the application's cache-version policy. An intentional discard/logout may clear the draft according to the data-layer contract.

One local inactivity reminder is scheduled two hours after workout start and rescheduled two hours after each newly completed set. It is cancelled after successful submission or explicit discard. The reminder is skipped when notification permission has not already been granted; starting a workout never prompts for permission.

## Finish Workout Flow

**Purpose:** End and submit the workout with the fewest necessary states while protecting the draft.

**User interaction:** Tap Finish. If sets remain unfinished, choose `Finish anyway` or return to the workout. A fully completed workout proceeds directly to saving without another confirmation.

**UI behavior:** The flow contains only:

1. Incomplete workout confirmation, shown only when unfinished sets exist.
2. Saving state.
3. Final workout summary after confirmed server success.

A save failure is not a new screen. The existing top Error/Info component reports the failure and offers or accompanies a clear Retry path while the active workout remains intact.

**State transitions:** `active → optional incomplete confirmation → saving → summary`. On failure: `saving → active/retryable` with the same local draft. The draft is cleared only after successful server submission.

**Edge cases:** Duplicate taps produce one submission. If submission succeeds but cache invalidation fails, do not submit again. Empty/partial unfinished sets are not represented as performed work. Navigation or connectivity failure during saving never destroys the draft.

## Loading, Saving, Error, and Retry States

- Hydration completes before a new session can replace a persisted one.
- History loading and failure remain local to History and do not block logging.
- Video processing continues independently of the visible workout context.
- Saving prevents duplicate submissions and retains the local draft.
- Save failure uses the existing top Error/Info system; Retry uses the retained draft.
- Successful submission clears the local session and invalidates relevant workout/history queries.
- Trivial interactions do not trigger notifications.

## Workout Completion and Summary

The summary appears only after server confirmation. It presents factual returned or reliably calculated outcomes such as duration, completed sets, exercise count, total volume, and confirmed PRs. It may identify added exercises and extra completed sets. It must not invent analysis or performance metrics.

## Complete Workout Session Flow

1. Start a workout; create and immediately persist its draft and start timestamp.
2. Log weight/reps for the current set; every edit persists immediately.
3. Tap `Done` to explicitly complete the set, move to the next unfinished set, and start elapsed rest at `00:00`.
4. Finish rest when ready, or continue navigating and logging while the global measurement runs.
5. Move freely between exercises/sets, reorder in the navigator, or reuse the CreateWorkout picker to add an exercise.
6. Add extra sets when needed; the navigator itself shows `EXTRA` and completion.
7. Use secondary tools when needed: notes, unified History/Fill Values, or supported upload-based Video Analysis.
8. If the app later boots with an active persisted draft, use the single Resume Workout state to restore it exactly.
9. Tap Finish. Confirm only when the workout is incomplete, then save.
10. On failure, keep the draft and retry through the existing error system. On success, clear the draft, invalidate relevant queries, and show the final summary.

## Important Edge Cases and Expected Behavior

- Backgrounding or process termination does not reset workout or elapsed-rest timing.
- Switching or reordering never loses partial input.
- Completing another set replaces the active rest measurement immediately.
- Manual entry and Fill Values remain distinct from completion.
- History and analysis failures never block workout logging.
- Planned exercises cannot be removed through the spontaneous-exercise removal action.
- Removing an added exercise with data requires confirmation.
- Finishing with incomplete sets is allowed after explicit confirmation.
- Failed submission retains a complete, retryable local draft.
- Successful submission is idempotent from the user's perspective.

## Design-System Rules Specific to Workout Session

- Preserve the approved dark-header / white-content visual language and current application color palette.
- Use large numeric typography and gym-appropriate touch targets.
- Keep informational content flat; reserve rounded surfaces for real controls and focused overlays.
- Do not use card-on-card layouts or a permanent large rest region.
- Do not show application bottom navigation in an active workout.
- Do not use a large Complete Set button; use compact explicit `Done`.
- Reuse CreateWorkout's exercise picker, TrackHistory's chart, and the application's top Error/Info component.
- Do not add success/info/error toasts specific to Workout Session.
- Do not show disabled Video Analysis actions.
- Do not display Estimated 1RM.

## Implementation Contract

Future implementation must preserve these invariants:

- A workout does not end merely because its screen is no longer visible.
- No application bottom navigation is shown inside an active workout.
- Only one exercise is displayed on the primary logging screen.
- Switching exercises or sets never loses entered data.
- Every valid weight/reps change is persisted immediately.
- `Done` does not save values; it only explicitly marks the set completed and starts rest tracking.
- Weight/reps entry and Fill Values never complete a set.
- Rest is elapsed time counting upward from a persisted start timestamp.
- Rest continues independently of the visible exercise.
- `Finish Rest` ends rest; there is no countdown, configured duration, or Skip action.
- Completing another set replaces/restarts rest measurement without confirmation.
- Extra sets and spontaneous exercises contribute to workout progress.
- Planned and spontaneous exercises remain distinguishable through `ADDED`; additional sets use `EXTRA`.
- Add Exercise reuses the CreateWorkout exercise picker.
- Exercise History is the only entry point for previous-performance browsing and Fill Values.
- History reuses the TrackHistory chart and selection behavior.
- There is no separate Autofill flow and no Undo action.
- Reordering never changes exercise identity or associated workout data.
- Unsupported Video Analysis actions are omitted rather than disabled.
- Video Analysis supports Upload, Trim, Process, and Result only; it does not offer recording.
- Analysis results display only fields supplied by the real API contract.
- Video processing never blocks logging or rest tracking.
- Ordinary visible interactions do not create redundant notifications.
- Errors and necessary information reuse the application's existing top Error/Info component.
- Resume is one bootstrap state that restores the exact persisted exercise, set, values, order, progress, and rest state.
- A fully completed workout proceeds directly to saving; only an incomplete workout requires confirmation.
- Failed submission never destroys the local workout draft.
- The draft is cleared only after successful submission or an explicitly authorized discard/logout policy.
- Estimated 1RM is not part of this UX.
