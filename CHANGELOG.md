# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.6.0](https://github.com/kobihanoch/Strong-Together-App/compare/v1.5.0...v1.6.0) (2025-03-31)


### Features

* **home:** change home UI colors ([238fa21](https://github.com/kobihanoch/Strong-Together-App/commit/238fa21175dc260d45a69f1f8d20a9a6afbaa80e))
* **home:** changed home UI colors ([8e94907](https://github.com/kobihanoch/Strong-Together-App/commit/8e949077c40cb20067db8c328abdd0e96ec8c98f))
* **statistics:** added comparing to last workout ([e0d7502](https://github.com/kobihanoch/Strong-Together-App/commit/e0d7502e039f192d8567583ec1529548b3f4b57d))
* **statistics:** added picture of muscle for UI ([da4935b](https://github.com/kobihanoch/Strong-Together-App/commit/da4935b77d8c733469e9374a88c82538c57f8003))
* **statistics:** added UI feature for PR set ([a7a65d3](https://github.com/kobihanoch/Strong-Together-App/commit/a7a65d3f37eede110368181f8feabbe7bc75f740))
* **statistics:** create Statistics screen (initial layout)" ([1bc6028](https://github.com/kobihanoch/Strong-Together-App/commit/1bc6028e0e6e3a6b90f1d0eba94e159f887b168e))
* **statistics:** created basic exercise flatlist UI by dates of workout ([99f57ad](https://github.com/kobihanoch/Strong-Together-App/commit/99f57ad0bbd3234b1eb64146d81b27816b7bd4bc))
* **statistics:** created screen statistics with calendar card ([fdd58eb](https://github.com/kobihanoch/Strong-Together-App/commit/fdd58ebb4890e3e74e61b536917b57c52bbe028a))
* **statistics:** fixed comparing to last workout assigned per exercise ([dbf0899](https://github.com/kobihanoch/Strong-Together-App/commit/dbf08998e2c3b0801a128d23bcb3d96479049d6f))
* **statistics:** page logic handles user's exercise tracking data ([b24a95e](https://github.com/kobihanoch/Strong-Together-App/commit/b24a95e303c2b0565f65625d07a4016cc976a6dd))
* **statistics:** smart comparing, updated comapring defines if last record is from last workout ([60cb616](https://github.com/kobihanoch/Strong-Together-App/commit/60cb616047801450811ea6857b2144b51d6f52f4))
* **statistics:** UI changed ([d410d86](https://github.com/kobihanoch/Strong-Together-App/commit/d410d863fb6a74f8867f7186d799c66f086abb6e))
* **statistics:** week calendar is fully functional ([a2f2cde](https://github.com/kobihanoch/Strong-Together-App/commit/a2f2cde33fdeda1fd9be7a496d3a3eac1ae5791e))
* **userworkout:** hook and service handles fetch of user exercise tracking data ([be71d71](https://github.com/kobihanoch/Strong-Together-App/commit/be71d714d74d18562cd5aeff3e3f441bc5dbb8b3))
* **utils:** created format date function for statistics ([772de87](https://github.com/kobihanoch/Strong-Together-App/commit/772de878da6dc1448263ad3a5a9b99bf85eb15c2))
* **workoutService:** fetch target muscle and specific target muscle in exercise tracking ([27d154a](https://github.com/kobihanoch/Strong-Together-App/commit/27d154a530e45ca7a3d2ba13c30a40624f67b881))

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
