# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.12.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.11.0...v2.12.0) (2025-05-23)


### Features

* **auth:** add loading state during user session initialization ([7f0e544](https://github.com/kobihanoch/Strong-Together-App/commit/7f0e544fc35cc4dcf6454f8d93bfa1c593c9ae2f))
* **auth:** enhance user session initialization with workout data and tracking ([b18474b](https://github.com/kobihanoch/Strong-Together-App/commit/b18474b57f344ec90a4db0fc9cf61da00f4deadf))
* **auth:** expose workout state setters in AuthContext ([3381819](https://github.com/kobihanoch/Strong-Together-App/commit/3381819092e511e5201778c9c86f3444dfbf4097))
* **CreateWorkoutContext:** integrate workout data from useAuth ([44da6d7](https://github.com/kobihanoch/Strong-Together-App/commit/44da6d7017a4bb1d49e8d60599d9117e34519d67))
* **CreateWorkoutContext:** supports cache updating on modifying workout ([b8939bf](https://github.com/kobihanoch/Strong-Together-App/commit/b8939bfbe8b98cc0338b1d5bfa378650a57f5067))
* **homepage:** getting user workout data from context ([5908ff4](https://github.com/kobihanoch/Strong-Together-App/commit/5908ff437d987c8e8a822429d1e4a73ff2982fe3))
* **ModifySplitNamesScreen:** add confirmation alert for resetting workout on back navigation ([049cde3](https://github.com/kobihanoch/Strong-Together-App/commit/049cde3b970b70586d12f52ec72f26cb617fce8c))
* **StartWorkout:** add confirmation alert before finishing workout ([f41d81d](https://github.com/kobihanoch/Strong-Together-App/commit/f41d81d774c626409ce714fd840a8af49e3ff7df))
* **startworkout:** implement BottomModal component for displaying last workout data ([e7db59d](https://github.com/kobihanoch/Strong-Together-App/commit/e7db59dd5089a9e4da2854ef98c07f66b243e650))
* **startworkout:** new workout mode is ensuring that user can't leave to inbox page in the middle of workout ([9748e5f](https://github.com/kobihanoch/Strong-Together-App/commit/9748e5f221137cdbc70f1b99f249501dfe367793))
* **statistics:** getting user workout data from context ([e95f4ed](https://github.com/kobihanoch/Strong-Together-App/commit/e95f4ed1d0078d74034f786fe1b357ab52641ebf))
* **useLastWorkoutExerciseTrackingData:** add custom hook for tracking last workout exercise data ([9788386](https://github.com/kobihanoch/Strong-Together-App/commit/97883864fc83f9122862729b16f2e48c33d6c54a))
* **useStartWorkoutPageLogic:** update exercise tracking and cache on workout save ([e1580d8](https://github.com/kobihanoch/Strong-Together-App/commit/e1580d803f9dad2b18b6e00c8811be9e6c57a37b))
* **useUserWorkout:** improve data fetching and state management ([440e8dd](https://github.com/kobihanoch/Strong-Together-App/commit/440e8dd93aa71e95cfe870770bc01e97b12a7087))
* **workout:** getting user workout data from context ([28d7cd3](https://github.com/kobihanoch/Strong-Together-App/commit/28d7cd36549bb442c011caa57ddb1e224772dd31))


### Bug Fixes

* add eas.json to .gitignore ([066cbf4](https://github.com/kobihanoch/Strong-Together-App/commit/066cbf4ab26d86f29074e1a897ccfb20f775fd29))
* **auth:** fixed auth listener ([990b45c](https://github.com/kobihanoch/Strong-Together-App/commit/990b45cdc5ff102cdefd99710b22cc34fc14375b))
* **AuthProvider:** enhance logout process and clear states on user sign out ([303195d](https://github.com/kobihanoch/Strong-Together-App/commit/303195d536716ece401b8399a9c001c2630edf47))
* await user session initialization and handle auth state changes with refresh token ([061f238](https://github.com/kobihanoch/Strong-Together-App/commit/061f238bd272d82463eba1ccb499675aa7d6bc0d))
* improve login error handling and input validation ([c5df7ba](https://github.com/kobihanoch/Strong-Together-App/commit/c5df7ba701dc8b6aafc3d9ef0fbeaded5afbb00c))
* **Profile:** update label and format for days online display ([5c04003](https://github.com/kobihanoch/Strong-Together-App/commit/5c040039ddb02c3cf266907ae01ab2df264abce0))
* **sharedUtils:** return an empty object instead of null for splitTheWorkout ([82cd62a](https://github.com/kobihanoch/Strong-Together-App/commit/82cd62a4bee3986942b24ee72f6bd6cd3c57a5da))
* **startworkout:** workout timer is working even if screen is not focused in app ([413fba4](https://github.com/kobihanoch/Strong-Together-App/commit/413fba4add42ca4e1bc8921133dcc7a5d6997e3b))

## [2.11.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.10.0...v2.11.0) (2025-04-17)


### Features

* **home:** add animated display for total workout count in workout count card ([7a07abf](https://github.com/kobihanoch/Strong-Together-App/commit/7a07abfa397b52799d344fc0fa28517eeac9d2ed))
* **home:** add animation to most common card progress indicator ([af4a9c0](https://github.com/kobihanoch/Strong-Together-App/commit/af4a9c0d834fdcf255f4e7ce7d7d1ba1191c7bae))
* **home:** add modal for displaying personal record details in PR section ([f6e8de5](https://github.com/kobihanoch/Strong-Together-App/commit/f6e8de57407ee965ff9a79d75b4803987856a064))
* **workout:** sort workout splits by name and add refetch logic on focus ([a56cd39](https://github.com/kobihanoch/Strong-Together-App/commit/a56cd3921b96d723afdc85fbb907e79a949236f2))


### Bug Fixes

* ensure dateOfPr is set correctly in getUserGeneralPR function ([c920278](https://github.com/kobihanoch/Strong-Together-App/commit/c920278470cbb367c048004a5f058a6ba96fb2e7))
* **exercise:** conditionally render progress bar based on reps for visible set ([c8b75c3](https://github.com/kobihanoch/Strong-Together-App/commit/c8b75c3b5fd8abc867096582b18227d4ead899ed))
* **home:** improve handling of personal record display in NewAchivementCard ([4e79a15](https://github.com/kobihanoch/Strong-Together-App/commit/4e79a1506467a2112ce13d9ac741bfb532cf51af))
* **workout:** exercise management by adding new exercise handling and synchronization logic ([da4e6b5](https://github.com/kobihanoch/Strong-Together-App/commit/da4e6b541791761aedf04c06dcdca6bc8c9e74f1))

## [2.10.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.9.0...v2.10.0) (2025-04-16)


### Features

* **muscles:** update various asset images for improved quality ([03eb0af](https://github.com/kobihanoch/Strong-Together-App/commit/03eb0afaa4cc33d8ae828277f64296584bd99b77))

## [2.9.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.8.1...v2.9.0) (2025-04-16)


### Features

* **createworkout:** refactored logic flow to use context instead of parent-child props flow ([1784230](https://github.com/kobihanoch/Strong-Together-App/commit/17842300f80a86b9a5fd874f2b93c0a7862c9bf3))

### [2.8.1](https://github.com/kobihanoch/Strong-Together-App/compare/v2.8.0...v2.8.1) (2025-04-13)


### Features

* **register:** new UI feture activity indicator while loading registeration ([4a297b6](https://github.com/kobihanoch/Strong-Together-App/commit/4a297b6cfe1a28f2524e2b2f87d49c046e3808d1))


### Bug Fixes

* **register:** fixed guest unable to register ([f5bd51b](https://github.com/kobihanoch/Strong-Together-App/commit/f5bd51b0a0d0998afbb30dd7c33308e9fec57591))

## [2.8.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.7.0...v2.8.0) (2025-04-13)


### Bug Fixes

* **auth:** get email with RPC function, no fetch for full user before logging in ([0f91115](https://github.com/kobihanoch/Strong-Together-App/commit/0f9111578dfc933cacb58ee569671e505a8510ef))
* **auth:** using edge function instead of RPC to get email by username before auth ([7bb9fdc](https://github.com/kobihanoch/Strong-Together-App/commit/7bb9fdc677a149c41234f621ee97c0187a041c73))
* **login:** login is now secured with edge functions ([f408274](https://github.com/kobihanoch/Strong-Together-App/commit/f40827420861d7edfb5160f0c8b8b22e9bcbc09e))
* **session:** edg function is now returning session details to use on client ([9e3c35c](https://github.com/kobihanoch/Strong-Together-App/commit/9e3c35c80ca94d60a942b2152a9e619654fc798f))

## [2.7.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.6.0...v2.7.0) (2025-04-12)


### Features

* **messages:** user now can delete messages from inbox ([10fb100](https://github.com/kobihanoch/Strong-Together-App/commit/10fb10025a2a08fadb93c240c6a8bbd7b01441a9))
* **messages:** user now gets a cheering message after completed workout ([bdc89ed](https://github.com/kobihanoch/Strong-Together-App/commit/bdc89ed5448a50ef16bcd3238627ac9bed143bdd))

## [2.6.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.5.0...v2.6.0) (2025-04-12)


### Features

* **messages:** new user gets a greetin message to inbox after register ([d8aa113](https://github.com/kobihanoch/Strong-Together-App/commit/d8aa113d3d6d298ee3daff8c1840aec5f2d68827))
* **messages:** new welcome message to new user ([7c2a74c](https://github.com/kobihanoch/Strong-Together-App/commit/7c2a74cf88918f6eeb5d46317ce64a09212ebdbc))
* **messages:** system can now send messages to user ([9625136](https://github.com/kobihanoch/Strong-Together-App/commit/9625136eedf415eb5c4b9ce33f135bba91cb3da8))


### Bug Fixes

* **homelogic:** fix import crashing ([63631c3](https://github.com/kobihanoch/Strong-Together-App/commit/63631c3f68f4a741f96be7563b9afd61a0f43b24))
* **home:** UI is now showing no data instead of N/A ([6132e59](https://github.com/kobihanoch/Strong-Together-App/commit/6132e59d6049f990325489a8d1c15b3182ad9d75))
* **messages:** optimize sender insertion & ensure correct profile image loading ([8697039](https://github.com/kobihanoch/Strong-Together-App/commit/8697039ab2aaa8edd75d24958dd3c6ebeafb46c9))

## [2.5.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.4.0...v2.5.0) (2025-04-11)


### Features

* **docs:** new readme for version ([a248830](https://github.com/kobihanoch/Strong-Together-App/commit/a248830d35f8027b494edd1ec5ad24d196bd4ebf))

## [2.4.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.3.1...v2.4.0) (2025-04-11)


### Features

* **readme:** readme updated ([1b31d60](https://github.com/kobihanoch/Strong-Together-App/commit/1b31d60abbac768da836cb09917287aa3eb3fcf0))

### [2.3.1](https://github.com/kobihanoch/Strong-Together-App/compare/v2.3.0...v2.3.1) (2025-04-11)

## [2.3.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.2.0...v2.3.0) (2025-04-11)


### Features

* **inbox:** created inbox with new UI ([639567f](https://github.com/kobihanoch/Strong-Together-App/commit/639567f8b26938e5c74049bc41112c7db30bbe40))
* **messages:** added modals to watch full message ([fb67c5a](https://github.com/kobihanoch/Strong-Together-App/commit/fb67c5ae90ba39f8609e75b4abc01974998bc120))
* **messages:** added profile pics near each message of sender, with a new modal UI ([4e54162](https://github.com/kobihanoch/Strong-Together-App/commit/4e54162b125c74b301299f7cf83941e7d5e1c4d5))
* **messages:** added realtime to update read state of message ([d8cab09](https://github.com/kobihanoch/Strong-Together-App/commit/d8cab09833ef8913d5ab2d056fe67c7b40721f23))
* **profilepicture:** defualt profile picture changes between male and female ([e0c3e6f](https://github.com/kobihanoch/Strong-Together-App/commit/e0c3e6f160aae3157382c44be4c82ad23f5604e3))
* **service:** added function in UserService to fetch username by user id ([ce6b426](https://github.com/kobihanoch/Strong-Together-App/commit/ce6b42680e6a839559558589966c144a0b54351c))
* **useuserdata:** added auto detch for username by inserting user id ([056bdc5](https://github.com/kobihanoch/Strong-Together-App/commit/056bdc5757eade609b1aa718d3b1a13360b8d658))

## [2.2.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.1.0...v2.2.0) (2025-04-09)


### Features

* **auth:** added real time updates for new messages ([ce3870a](https://github.com/kobihanoch/Strong-Together-App/commit/ce3870a889237aecfb0ce4edfe2d3ac3ff541b15))
* **auth:** added user notifications counter to top component, wip: full support of data base ([58a7188](https://github.com/kobihanoch/Strong-Together-App/commit/58a71880cb8370559df3f5eab8bfd25174924872))
* **auth:** get messages from DB and filter by read / unread ([7ad40dd](https://github.com/kobihanoch/Strong-Together-App/commit/7ad40dd65f9290f37ae8e9bab9599ece67bcf209))
* **notifications:** added push notifications when receiving a message. Only work after build ([7dcf2d6](https://github.com/kobihanoch/Strong-Together-App/commit/7dcf2d6a4e9ce3b1ea9a2a90fd37bc1341acfae9))
* **service:** added new service for UserService to load use messages ([4c73c47](https://github.com/kobihanoch/Strong-Together-App/commit/4c73c472d4755b6a1d3e31ab0aa95341bf47b0d3))
* **topcomponent:** added icon bump when getting a new message ([cefe3be](https://github.com/kobihanoch/Strong-Together-App/commit/cefe3be4d52d80df9b18646ea3a38ca59c2c6b74))
* **topcomponent:** count unread messages to display number on bell icon ([2e7dace](https://github.com/kobihanoch/Strong-Together-App/commit/2e7daced4b1dd4747efcc5d2cb9f9f14ae002e50))

## [2.1.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.0.2...v2.1.0) (2025-04-08)


### Features

* **profile:** recreated profile page ([6c5177d](https://github.com/kobihanoch/Strong-Together-App/commit/6c5177d12055315dfc9e5dfa174614535481c074))
* **settings:** created settings page ([3cadb99](https://github.com/kobihanoch/Strong-Together-App/commit/3cadb99a3a918c828c31143e631c1228556cce05))

### [2.0.2](https://github.com/kobihanoch/Strong-Together-App/compare/v2.0.1...v2.0.2) (2025-04-08)


### Bug Fixes

* **auth:** user is loaded with new state of has worked out today, supported by using new utils file ([76001cc](https://github.com/kobihanoch/Strong-Together-App/commit/76001cc0d0267c31e943d9466b63bb9d8030044c))

### [2.0.1](https://github.com/kobihanoch/Strong-Together-App/compare/v2.0.0...v2.0.1) (2025-04-07)


### Features

* **topcomponent:** added calendar button ([2dd89e5](https://github.com/kobihanoch/Strong-Together-App/commit/2dd89e5680dafca374f56ee9973a190d0f81b429))


### Bug Fixes

* **auth:** log in / log out is now working without errors/warnings ([a8d37fb](https://github.com/kobihanoch/Strong-Together-App/commit/a8d37fbf33d94860ac83920e886ada4be0e5a7ba))
* **auth:** log in and log out / auth load user has changed ([40a60c6](https://github.com/kobihanoch/Strong-Together-App/commit/40a60c6e863626bc882ac348a4e1354b92120dd6))
* **auth:** smooth log in and log out - app is refreshing after log out ([0fce59f](https://github.com/kobihanoch/Strong-Together-App/commit/0fce59f7ce9629611c89d44d89e193810755f425))
* **login:** redirect to home page after log in function deleted, handled now by App.js and by isLoggedIn ([7569137](https://github.com/kobihanoch/Strong-Together-App/commit/7569137c2ae9de5d74f50129487a0cdc0fccbb97))
* **tabbar:** now tab bar is showing home page is selected after log in ([f3d8ac2](https://github.com/kobihanoch/Strong-Together-App/commit/f3d8ac2767e35f2e84c88c4e781698b394f955d0))

## [2.0.0](https://github.com/kobihanoch/Strong-Together-App/compare/v1.6.0...v2.0.0) (2025-04-06)


### Features

* **createworkout:** changed UI for create / edit workout page ([4352e6b](https://github.com/kobihanoch/Strong-Together-App/commit/4352e6b360dc4b09f890eebeafc1dc9cf362309e))
* **gotobutton:** stopped supporting component ([ad138ec](https://github.com/kobihanoch/Strong-Together-App/commit/ad138ecf13484bb4b39fe7abbde17cdd41fb5c7c))
* **home:** new cards UI for home page ([79dbbbf](https://github.com/kobihanoch/Strong-Together-App/commit/79dbbbf2bddb4a506f7d266333ee1ee8a4edc848))
* **home:** update UI ([db218a5](https://github.com/kobihanoch/Strong-Together-App/commit/db218a5aaabc343733ea6d4f2095fbaa30062dff))
* **login:** added activity indicator to login button while logging in ([8126217](https://github.com/kobihanoch/Strong-Together-App/commit/81262173ac4073ed1f5b743b735c07064af054cb))
* **myworkoutplan:** added feature - if user did a workout today he is not able to start another one ([ccd013d](https://github.com/kobihanoch/Strong-Together-App/commit/ccd013d7561e31700e783685815956573928eaa9))
* **myworkoutplan:** new UI for my workout plan page ([6bafc45](https://github.com/kobihanoch/Strong-Together-App/commit/6bafc453a311d141f1b2c52e582827fbf81af46e))
* **startworkout:** changed UI and refactor data saving ([b2df7aa](https://github.com/kobihanoch/Strong-Together-App/commit/b2df7aa00bb1f762539b06499d46f8c8ca43a0b2))
* **statistics:** load current day workout stats on start up is working ([33b9301](https://github.com/kobihanoch/Strong-Together-App/commit/33b930130c9225bf807a6a1670f0398165541323))
* **statistics:** update new UI for statistics page ([36f3de6](https://github.com/kobihanoch/Strong-Together-App/commit/36f3de64f4dccd46a3fd1e9588faf4cb1894181a))
* **statistics:** updated UI of calendar strip ([9b2fa64](https://github.com/kobihanoch/Strong-Together-App/commit/9b2fa64d1ab412d4b18ab492bba3c83a4fc6cfba))
* **tabbar:** updated UI for botton tab bar ([6787c29](https://github.com/kobihanoch/Strong-Together-App/commit/6787c29c3a4ad040ea7a0f77bc789fff7c4dc3c0))
* **topcomponent:** updated UI for top bar ([a7e2e33](https://github.com/kobihanoch/Strong-Together-App/commit/a7e2e33b4b4f80d42353a680fd5dd3008b47b96d))
* **ui:** changed fonts to Inter ([dbc6527](https://github.com/kobihanoch/Strong-Together-App/commit/dbc652742c5fc29d56d6038322c226c420a399a1))


### Bug Fixes

* **auth:** user trouble to stay logged in after token refresh is now solved ([c32c1e0](https://github.com/kobihanoch/Strong-Together-App/commit/c32c1e00c6ccd918910c4a821401cf535fff97b1))
* **fonts:** loading correctly ([1a19c81](https://github.com/kobihanoch/Strong-Together-App/commit/1a19c81658f367a0300fbf711af0c913cbca0ef3))
* **home:** fixed home page crashing with user without workout assigned ([d45073a](https://github.com/kobihanoch/Strong-Together-App/commit/d45073a37229fb54a08a0e3d61466d55adcd07b8))
* **navigation:** BottomTabBar now highlights correct tab after logout/login flow ([a3e6179](https://github.com/kobihanoch/Strong-Together-App/commit/a3e6179b44c59e3f09f1e6e1793bc51bcdf25ac4))
* **settings:** fixed crashing when loading settings page ([c9e6968](https://github.com/kobihanoch/Strong-Together-App/commit/c9e69682818edf4766d50cae34556c9cb1858759))

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
