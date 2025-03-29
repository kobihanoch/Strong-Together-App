# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.5.0](https://github.com/kobihanoch/Strong-Together-App/compare/v1.4.1...v1.5.0) (2025-03-29)


### Features

* **hooks:** extend useUserWorkout to return full workout, splits and exercises ([e2042fb](https://github.com/kobihanoch/Strong-Together-App/commit/e2042fb13845b055eb64a334b750ea3808b9505e))
* **profile:** add username, full name and email labels to profile page ([68c3f92](https://github.com/kobihanoch/Strong-Together-App/commit/68c3f92f065b428beb3c59bdb0d1e92d247aa6eb))
* **profile:** changed profile page UI ([c16dc3e](https://github.com/kobihanoch/Strong-Together-App/commit/c16dc3ebb1330fc1b18874ebdc60a18c02f7b814))
* **service:** WorkoutService.js added fetching from exercises also ([4980afd](https://github.com/kobihanoch/Strong-Together-App/commit/4980afd1479bf33f802a2ac6669ea7843c866016))

### [1.4.1](https://github.com/kobihanoch/Strong-Together-App/compare/v1.4.0...v1.4.1) (2025-03-26)

Refactor
auth: moved login and registration logic to a dedicated AuthService file (19e8c6b)

auth: created useAuthActions hook to manage login status and loading state (4bfff05)

## [1.4.0](https://github.com/kobihanoch/Strong-Together-App/compare/v1.3.0...v1.4.0) (2025-03-26)

### Features

- **auth:** refactor authentication flow to use Supabase Auth, migrate to UUID for user IDs, and update login/register handling ([fb79d45](https://github.com/kobihanoch/Strong-Together-App/commit/fb79d459feda69a5ec348f948433a32479889789))
- **auth:** use Supabase session with AsyncStorage ([54edc40](https://github.com/kobihanoch/Strong-Together-App/commit/54edc400542b9b408ecb04fc93a7d25968bd5bde))
- none ([76fc2ee](https://github.com/kobihanoch/Strong-Together-App/commit/76fc2eeae2bed6703927f26529fee321a8a5445f))

### Bug Fixes

- **auth:** use .single() to correctly fetch user data on login ([a5b2f52](https://github.com/kobihanoch/Strong-Together-App/commit/a5b2f52d08a09d9595a10e98473ca52e71f97be1))

## [1.3.0] - 2025-03-25

- Merge dev into main
- Profile page, homepage UI changes
