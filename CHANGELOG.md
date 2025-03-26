# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
