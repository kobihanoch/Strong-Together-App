# Strong Together — UI Redesign Proposal

## Product goal

The redesign should make the app feel like a focused training companion: open the app, understand today's workout, start quickly, and see whether training is improving. The home screen should answer three questions in order:

1. What should I do today?
2. What did I do recently?
3. What improved?

The current home experience gives too much space to the user's most frequent split and to a four-cell all-time PR card. A frequently performed split is not necessarily the correct next workout, so it should not drive Quick Start.

## 1. Color palette

The logo contains a warm orange-to-yellow gradient, which remains the brand signature. The existing blue (`#2979FF`) is the primary interaction color. Blue communicates action, navigation, training data, aerobics, and focus; orange communicates achievement and brand energy.

### Recommended palette: “Built by Fire”

| Token | Hex | Use |
|---|---:|---|
| `brandOrange` | `#FF7A00` | Achievements, PRs, and selective brand highlights |
| `brandAmber` | `#FFB800` | Gradient midpoint, progress, secondary highlights |
| `brandYellow` | `#FFD600` | Gradient endpoint; use sparingly |
| `brandGradient` | `#FF7A00 → #FFD600` | Achievement badges and rare brand moments |
| `brandBlue` | `#2979FF` | Primary CTAs, active navigation, aerobics, data visuals, and links |
| `brandBlueDark` | `#2962FF` | Pressed blue controls and accessible blue emphasis |
| `brandBlueSoft` | `#EAF2FF` | Blue icon containers, chart backgrounds, informational cards |
| `ink` | `#17130F` | Primary text and dark surfaces |
| `inkSoft` | `#342D26` | Elevated dark cards |
| `canvas` | `#FAF8F5` | Main light background; warmer than pure white |
| `surface` | `#FFFFFF` | Cards and sheets |
| `surfaceMuted` | `#F2EEE8` | Grouped sections and input backgrounds |
| `textSecondary` | `#756B61` | Supporting copy |
| `border` | `#E7E0D8` | Dividers and card outlines |
| `success` | `#17875B` | Completed goals and positive change |
| `danger` | `#D64545` | Errors and destructive actions |
| `info` | `#2979FF` | Informational states and data |

### Usage rules

- Use `brandBlue` for primary CTAs, active navigation, links, and key data.
- Use `brandOrange` and the warm gradient for achievements or small brand moments; do not use yellow for body text on white.
- Do not place blue and the warm gradient on competing actions.
- Keep approximately 70% neutral surfaces, 15% dark structure, 10% blue, and 5% warm brand accents.
- Reserve green and red for semantic success and error states.
- Support dark mode later with `#100E0C` canvas, `#1C1814` surfaces, and the same warm accents.
- Check all text/background combinations against WCAG AA. Primary blue buttons use white text.

### Dark theme palette

| Role | Value |
|---|---:|
| Canvas | `#100E0C` |
| Surface | `#1C1814` |
| Muted surface | `#29231E` |
| Border | `#3A312A` |
| Primary text | `#F8F5F1` |
| Secondary text | `#B8AEA4` |
| Primary blue | `#5B9BFF` |
| Soft blue | `#172B49` |
| Achievement orange | `#FF9A32` |

Both palettes live in `shared/constants/theme.ts`. Theme selection is owned by the top-level `AppThemeProvider`; it uses a temporary mocked light value until settings persist the user's choice.

## 2. Design direction

### Direction: “Modern performance, human warmth”

The visual language should be athletic and data-aware without looking like a dense bodybuilding spreadsheet. The warm logo colors provide energy; strong typography, generous spacing, and restrained surfaces provide confidence.

### Core principles

- **Action before analytics:** Today's workout and the Start button always come first.
- **Next best action, not most common behavior:** Recommendations should come from the plan schedule, recovery/last-completed state, or an explicit user choice.
- **Progressive disclosure:** Home shows a summary; detail screens contain charts and tables.
- **One visual system:** Use blue for action and data, the warm logo gradient for achievement, and semantic green/red only for status.
- **Calm data:** Prefer one clear trend, comparison, or progress value over pie charts and grids of metrics.
- **Personal but compact:** Keep the greeting, avatar, and notification access, but reduce header height.

### Visual system

- **Typography:** Keep Inter. Use 28–32 px bold page titles, 18–20 px semibold section titles, 15–16 px body text, and 12–13 px labels. Use tabular numerals for metrics where supported.
- **Layout:** 16 px screen gutters, 12–16 px gaps, and an 8 px spacing grid. Avoid sizing primary layout with screen-height percentages.
- **Cards:** 16–20 px radius, subtle 1 px warm-gray border, little or no shadow. Use a dark hero card for Today's Workout.
- **Icons:** Use one outlined icon family. Filled icons indicate selected/active state only.
- **Motion:** 180–240 ms transitions; light haptic feedback when starting or completing a set. Respect reduced-motion settings.
- **Charts:** Direct labels, no decorative pie charts, consistent time ranges, and accessible non-color indicators for change.

## Navigation and information architecture

Use four primary tabs:

1. **Home** — today, consistency, recent progress
2. **Plan** — workout schedule, exercises, plan editing
3. **Progress** — history, analytics, PRs, trends
4. **Profile** — personal details, notifications, and settings

This merges the current Statistics and Analytics destinations into **Progress**, and moves Settings under Profile. The center floating Start tab is unnecessary because the primary Start action is already prominent on Home and Plan.

## Screen direction

### Home

1. Compact greeting, avatar, and notification button
2. Next Workout hero: next split in plan rotation, planned exercises/sets, and a blue Start/Resume CTA
3. Gym Activity: a simple two-column card with a blue total-workout value and an orange last-trained accent; avoid rings and decorative metric circles
4. Latest Achievement: one recent PR with its estimated 1RM attached as plain supporting text; do not add a badge container or decorative graph
5. Last Workout: date, split, exercise/set totals, and a History link
6. Weekly Aerobics: a compact seven-day visualization derived from the existing aerobics map

Show at most one primary and two secondary actions. Remove the separate Quick Actions list; navigation already provides Progress and Plan.

### Styling rules for future pages

- Use `#FAF8F5` for the page canvas and white for content cards.
- Use 16 px horizontal screen padding and an 8 px spacing grid.
- Use 18–20 px card radii, a 1 px `#E7E0D8` border, and restrained shadows.
- Use dark photographic hero cards only when a page has one dominant task.
- Use solid `#2979FF` for the dominant CTA, selected tab, links, and key data marks.
- Use orange/yellow only for achievements, PRs, recency/flame accents, and small brand moments.
- Use Inter throughout: bold metrics, semibold headings, and regular supporting copy.
- Read palette values from `shared/constants/colors.ts` and typography from `shared/constants/typography.ts`; do not introduce screen-local font sizes or brand colors.
- Use the shared typography scale, which applies `RFValue`, for all text sizes.
- Derive proportional card and chart dimensions from `useWindowDimensions`, then clamp them to practical minimum and maximum values so small and large iPhones retain the same hierarchy.
- Prefer compact labeled rows and directly labeled charts over decorative diagrams.
- Keep one primary action per screen and expose secondary actions through rows, links, or menus.
- Every screen must define loading, empty, error, and populated states without changing its basic layout.

### Plan

- Week/split overview first
- Clear “Edit plan” secondary action
- Exercise rows with muscle, sets × reps, and optional last-performance hint
- Empty state that guides the user through creating a first plan

### Active workout

- Large current exercise and set number
- Fast weight/reps entry with previous-set values visible
- Persistent rest timer and Finish action
- Collapse video analysis and notes behind secondary actions so logging stays fast

### Progress

- Default to a useful recent range such as 4 or 8 weeks
- Overview: workouts, consistency, total volume trend, and recent PRs
- Exercise detail: estimated 1RM trend and set history
- History: calendar/list as a secondary tab
- Replace the split-frequency pie chart with weekly consistency or training-volume trend

### Profile and settings

- Profile identity and account controls on one screen
- Notifications, units, appearance, privacy, and sign-out grouped as settings sections
- Keep destructive actions visually separate

## Feature changes

### Keep and improve

- Workout-plan creation and editing
- Fast workout tracking and resume-after-interruption
- History
- Estimated 1RM and goal adherence
- Personal records
- Video analysis, but as an optional exercise-level tool
- Notifications/inbox if messages provide real coaching or operational value

### Reduce or remove

- Remove `mostFrequentSplit` and `mostFrequentSplitDays` from the home recommendation.
- Do not show weekly strength-workout progress or a workout target because the current data does not support it.
- Remove `splitDaysByName` and its pie chart from the main analytics overview. It can remain only if a future plan-adherence view needs it.
- Merge Analytics and Statistics into Progress.
- Remove the home Quick Actions section.
- Replace the four-box all-time PR card with one compact recent achievement/trend card.
- Remove the fifth Settings tab and place Settings under Profile.
- Avoid a percentage that represents “share of workouts using the most frequent split”; it does not measure performance or adherence.

### Add

- A `nextWorkout` recommendation based on the next split in the plan rotation
- A compact weekly aerobics card sourced from the existing aerobics map
- Last-workout summary with duration and total volume
- Recent PR with improvement compared with the prior best
- A compact estimated 1RM insight
- Resume-workout state in the dashboard payload
- Clear first-workout, no-plan, rest-day, and already-trained-today states

## Implementation order

1. Introduce design tokens and shared primitives: screen, card, button, metric, section header, empty state.
2. Redesign Home around the next split in rotation, aerobics, last workout, achievement, and estimated 1RM.
3. Consolidate Analytics + Statistics into Progress.
4. Redesign Plan and the active-workout logging flow.
5. Consolidate Profile + Settings, then refresh auth/onboarding and inbox.
6. Add dark mode only after the light theme and semantic tokens are stable.

## Current-code notes

- `shared/constants/colors.ts` already contains the blue family; keep it and add the warm logo colors through semantic design tokens.
- `StartWorkoutCard` currently selects the most frequent split and calculates its percentage of all workouts. Replace this with `nextWorkout`.
- `HomePageData` currently includes `mostFrequentSplit`; replace that recommendation with the next split in plan rotation.
- The shared analytics schema currently exposes `_1RM`, while the client analytics hook reads `oneRepMaxes`. Resolve this naming mismatch before redesigning the Progress data layer.
