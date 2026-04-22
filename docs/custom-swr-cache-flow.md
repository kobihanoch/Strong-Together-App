# Custom SWR Cache Flow

## Table of Contents

1. [Purpose](#purpose)
2. [Core Flow](#core-flow)
3. [Provider Usage](#provider-usage)
4. [Bootstrap Optimization](#bootstrap-optimization)
5. [Cache Versioning](#cache-versioning)
6. [Related Files](#related-files)

## Purpose

The app uses a lightweight **SWR-inspired** cache flow instead of a generic data library. It is tuned for this app's auth timing, bootstrap API, offline behavior, and AsyncStorage persistence.

## Core Flow

`useCacheAndFetch` receives a user, cache-key builder, server-validation flag, fetch function, data setter, cached payload, and log label.

The flow is:

1. Build a stable cache key from the current user id.
2. Read local cache with `useGetCache`.
3. If cached data exists, render it immediately.
4. If no cache exists, expose loading so screens can show skeletons or loaders.
5. Wait for `isValidatedWithServer`.
6. Fetch fresh API data.
7. Update the provider state.
8. Persist the new provider payload with `useUpdateCache`.

This gives the mobile app **fast first paint**, **offline resilience**, and **stale-while-revalidate behavior** without hiding the auth requirements.

## Provider Usage

The pattern is used across multiple domains:

- `AuthProvider` caches authenticated user data.
- `MessagesProvider` caches inbox messages and derives unread messages.
- `WorkoutPlanProvider` caches workout plan and edit-ready plan data.
- `WorkoutHistoryProvider` caches exercise tracking maps and unpacked analysis data.
- `CardioProvider` caches daily and weekly cardio maps.
- Analytics hooks use the same idea for screen-level analytical data.

## Bootstrap Optimization

The API bootstrap interceptor maps common startup endpoints to slices of one `/api/bootstrap/get` response:

| Request | Bootstrap slice |
| ------- | --------------- |
| `/api/users/get` | `user` |
| `/api/workouts/gettracking` | `tracking` |
| `/api/aerobics/get` | `aerobics` |
| `/api/messages/getmessages` | `messages` |
| `/api/workouts/getworkout` | `workout` |

When bootstrap is open, tracked requests receive data through an Axios adapter instead of making duplicate network calls.

## Cache Versioning

Cache keys include app-version-aware cleanup. On boot, `cacheHousekeepingOnBoot()` removes stale `CACHE:` values from older app versions while preserving `CACHE:USER_ID` so returning users can still attempt soft login after updates.

## Related Files

- `shared/hooks/use-cache-and-fetch.hook.ts`
- `shared/hooks/use-get-cache.hook.ts`
- `shared/hooks/use-update-cache.hook.ts`
- `infrastructure/cache/cache.utils.ts`
- `infrastructure/cache/cache-keys.utils.ts`
- `infrastructure/api/api-config/bootstrap.ts`
