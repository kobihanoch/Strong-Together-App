# UI Test Agent Prompt

Use this prompt when assigning an AI agent to add UI tests for a new feature in this project.

## Prompt

You are working inside an existing React Native / Expo project.

Your task is to write **UI tests only** for a specific feature or screen in this codebase.

Before writing tests, you must first understand how the feature actually works in the project.

### Core requirements

1. Study the relevant flow before writing tests.
   Read the screen, related components, hooks, contexts, utils, DTOs, and API response types involved in that feature.

2. Build tests from reliable data structures.
   Do not invent random mock data unless it matches the actual shapes used in the project.
   Use the API response DTOs, context types, hook return types, and derived UI data types as the source of truth as much as possible.

3. Understand the full data flow.
   Trace data through:
   - API response DTOs
   - service or fetch layer
   - context state
   - derived hook logic
   - screen/component props
   - final UI rendering

4. Distinguish carefully between different “empty” states.
   Do not treat all missing data the same.
   Explicitly reason about the difference between:
   - `null`
   - `undefined`
   - empty object `{}`
   - empty array `[]`
   - empty string `''`
   - numeric zero values like `0`
   - partially populated objects

5. Determine whether `null` means:
   - still loading / no response yet
   - valid response but no data exists
   - logged-out / no user
   - reset state after logout
   - unsupported or missing relation

6. Cover UI edge cases, not only happy paths.
   The tests must include realistic edge cases based on the actual product logic.

### Important domain expectations

For any feature related to workouts, plans, tracking, analytics, or home/dashboard flows, explicitly check combinations like:

- user still loading
- no user
- user exists but workout is still loading
- user exists and has no workout plan
- user exists and has a workout plan but no tracking/history
- user exists and has tracking/history but no current workout plan
- user exists and has both workout plan and tracking/history
- user has a workout but has not trained today
- user has a workout and has already trained today
- workout exists but supporting derived data is missing
- tracking exists but recommended split / summary object is missing

If a specific feature has similar state combinations, create the equivalent matrix for that feature.

### Testing expectations

Write tests that verify:

- correct rendering for the normal state
- correct rendering for loading state
- correct rendering for empty state
- correct rendering for partial/incomplete data
- correct fallback UI when derived values are unavailable
- correct conditional UI when specific flags are true/false
- navigation triggers only where relevant for UI tests
- edge cases that could break rendering or show the wrong branch

### Constraints

- Do not change production code unless absolutely necessary.
- Prefer editing only the relevant test file unless the task explicitly requires more.
- Keep mocks aligned with real project structures.
- Do not assume that a missing field and an empty field mean the same thing.
- If the project already has test patterns, follow them.
- If the feature uses contexts, mock them in a way that reflects real lifecycle states.

### Workflow to follow

1. Read the relevant screen and related components.
2. Read the hook(s) and context(s) that feed the feature.
3. Read the DTOs / API response types that define the real data shape.
4. Identify all meaningful UI states.
5. Separate loading vs empty vs missing vs derived-null states.
6. Write UI tests for all important branches.
7. Run the relevant test file and confirm it passes.
8. Summarize what states were covered and which risks remain.

### Output expectations

When you finish:

- explain which files you inspected
- explain the real data model you relied on
- explain how you distinguished loading/null/empty states
- list the UI states covered by the tests
- mention any important edge cases that are still untested

Be rigorous. The goal is not just to make tests pass, but to ensure the tests reflect the real feature behavior and realistic data states in this codebase.
