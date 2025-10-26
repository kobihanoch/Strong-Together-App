# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.3.1](https://github.com/kobihanoch/Strong-Together-App/compare/v4.3.0...v4.3.1) (2025-10-26)


### Features

* **Offline Mode:** Delete stale data of cached workout. If another day pased by current timezone delete cache ([782d7cc](https://github.com/kobihanoch/Strong-Together-App/commit/782d7ccd6a491374adb7abc7dd3be7a04c1823b1))
* **Offline Mode:** Load unfinished workout without the message with userIdCache. Error log out wont delete start workout cache ([b5153be](https://github.com/kobihanoch/Strong-Together-App/commit/b5153be4e1c3c1213421d08e77d7847b0d75c6c9))


### Bug Fixes

* **Start Workout:** FIxed unexpeted autoscroll on unfocus ([4236932](https://github.com/kobihanoch/Strong-Together-App/commit/42369326388cfa3ad7e82f5fd5e82bbb489b1623))

## [4.3.0](https://github.com/kobihanoch/Strong-Together-App/compare/v4.2.0...v4.3.0) (2025-10-22)


### Features

* **Intro:** New gradient background ([4e22744](https://github.com/kobihanoch/Strong-Together-App/commit/4e22744484bf4d199e18455d11a10a84390badc1))
* **OAuth:** Added buttons to intro screen for signing in with Google/Apple ([fbcbff6](https://github.com/kobihanoch/Strong-Together-App/commit/fbcbff68b5b2f9e2398153cea01a2fefbaa8d14d))
* **OAuth:** Client implemented sign in with Google or Apple ([b5d2937](https://github.com/kobihanoch/Strong-Together-App/commit/b5d2937ac6fa0e6d3d4354365f1b9d1ced58f7f0))
* **OAuth:** Created a complete fields page ([aec636c](https://github.com/kobihanoch/Strong-Together-App/commit/aec636cc20742e1f8ae230347df8f6cfd9eccd7f))
* **OAuth:** Sign in with apple ([9ec9070](https://github.com/kobihanoch/Strong-Together-App/commit/9ec90703b8dd9a9a8ed29f28b4da05f071903d45))
* **Profile:** Change email requires email verification ([7ddfdb5](https://github.com/kobihanoch/Strong-Together-App/commit/7ddfdb57ba7cc98bca591e75fc3bdb02ac41cd7c))


### Bug Fixes

* **Register:** Gender is optional ([50f4f2c](https://github.com/kobihanoch/Strong-Together-App/commit/50f4f2c7ca302b67f4265060aed35c5b8dc9cdde))

## [4.2.0](https://github.com/kobihanoch/Strong-Together-App/compare/v4.1.1...v4.2.0) (2025-10-19)


### Features

* **Auth:** Keep user logged in with server down errors ([1a4ccbe](https://github.com/kobihanoch/Strong-Together-App/commit/1a4ccbe9476214f875929b54dda534e41ea4f52f))
* **DPoP:** Added DPoP proof to header ([e49f71d](https://github.com/kobihanoch/Strong-Together-App/commit/e49f71d17ce9f44673f8ac0b76e4188bea506d80))
* **DPoP:** DPoP is implemented ([ac23e71](https://github.com/kobihanoch/Strong-Together-App/commit/ac23e712b7b084f4b29d55926211284950532e2f))
* **DPoP:** Keypair creating at app startup (per device) ([ad391a0](https://github.com/kobihanoch/Strong-Together-App/commit/ad391a0b0ba28effe7d748c17d9649e6a1eebb6c))
* **Update Modal:** If upgrade is required don't log out user ([53c45b2](https://github.com/kobihanoch/Strong-Together-App/commit/53c45b288c04fd2de877e20abe4e90fb95c30fa3))

### [4.1.1](https://github.com/kobihanoch/Strong-Together-App/compare/v4.1.0...v4.1.1) (2025-10-13)


### Bug Fixes

* **Auth:** Ensure user stays logged in after update (housekeeping) ([b58b23a](https://github.com/kobihanoch/Strong-Together-App/commit/b58b23a6aff8582a304033c8306d99d9d2aaa06e))
* **Start Workout:** Fixed resume workout error after saved workout ([bbaab60](https://github.com/kobihanoch/Strong-Together-App/commit/bbaab60ba85a2190d05ca7f69c4836804eaf754e))

## [4.1.0](https://github.com/kobihanoch/Strong-Together-App/compare/v4.0.1...v4.1.0) (2025-10-08)


### Features

* **API:** Inject username and appversion to requests ([c39d909](https://github.com/kobihanoch/Strong-Together-App/commit/c39d909157554288e79105440d77d521b4bced23))
* **Auth:** Added cange email in verification ([e98adc4](https://github.com/kobihanoch/Strong-Together-App/commit/e98adc4e13af36560bb8bd2fdf31768936e3771b))
* **Auth:** Added state listner to auto log in after verifying (fallback via button) ([846aade](https://github.com/kobihanoch/Strong-Together-App/commit/846aadeaa074639db0b903dc83f8f3cdc8f97445))
* **Auth:** Reset password is implemented, and login with email/username ([3220962](https://github.com/kobihanoch/Strong-Together-App/commit/32209624b4ac5533409d0139b135146cd509b6f3))
* **Auth:** User verification via email has implemented ([5739b2f](https://github.com/kobihanoch/Strong-Together-App/commit/5739b2f0b8377c25b2198c59f80e32f00d181ca9))
* **Date and Time:** Adjusted pr date to UTC ([3606b0d](https://github.com/kobihanoch/Strong-Together-App/commit/3606b0d1a0cccb2d8b12e1d19c90d241f283f15a))
* **Date and Time:** Timezoned aerobics ([e86a547](https://github.com/kobihanoch/Strong-Together-App/commit/e86a547ab95c2fd7a8a7d73f06a12d787e3c7ffc))
* **Date and Time:** Using auto location timezone ([861a497](https://github.com/kobihanoch/Strong-Together-App/commit/861a497b983d29d851b598dd28577d97331da668))
* **Date and Time:** Workout updated_at and messages sent_at by timezone ([e8ac29e](https://github.com/kobihanoch/Strong-Together-App/commit/e8ac29e25ddc2815af93cc1820c6c0b47c35607b))
* **Errors:** Added a modal to get 426 update required error ([d30cccd](https://github.com/kobihanoch/Strong-Together-App/commit/d30cccd839a774ea46913e2c0f2fb8bf18606467))
* **Register:** Defined inputs types for iOS auto complete ([a530253](https://github.com/kobihanoch/Strong-Together-App/commit/a530253f54959963223cb1f160bd035ee041bf12))
* **Statistics:** Supports timezone view ([7c0d056](https://github.com/kobihanoch/Strong-Together-App/commit/7c0d056a189c1a3c47dbdb51bb65a2f250fe6f53))
* **Verification:** Added send email again ([533401b](https://github.com/kobihanoch/Strong-Together-App/commit/533401be0d0628cd5dc3d3494339d65e39237258))


### Bug Fixes

* **Cardio:** Added a UI spinner when loading ([cc16147](https://github.com/kobihanoch/Strong-Together-App/commit/cc16147fc3a2e68354fa985a8d58011e530fd417))
* **Create Workout:** Limit 10 exercises per split ([6ea53dc](https://github.com/kobihanoch/Strong-Together-App/commit/6ea53dc9efd9d6549f0734ba0f3e1a0759913194))
* **Start Workout:** Caching with debounce of 1 s ([083ec7b](https://github.com/kobihanoch/Strong-Together-App/commit/083ec7b6be8ef3a8c318ad59b2f91ec17fa15829))
* **Start Workout:** Max notes chars is 50 ([6fd80e3](https://github.com/kobihanoch/Strong-Together-App/commit/6fd80e33cb008543eea282092a4f1a2af03395d7))
* **Workout:** DIsabled multiple presses on save workout button on loading with activiry indicator and lock ref ([7715fe5](https://github.com/kobihanoch/Strong-Together-App/commit/7715fe5dd84a53a10e0e17317c94255f05bce1c0))

### [4.0.1](https://github.com/kobihanoch/Strong-Together-App/compare/v4.0.0...v4.0.1) (2025-09-30)


### Bug Fixes

* **Crash:** Fixed crashing on no exercises ([da975fc](https://github.com/kobihanoch/Strong-Together-App/commit/da975fc76d5120ef33c4b244f3b88081bedc3379))
* **Crash:** Fixed crashing on no muscle group ([a95c448](https://github.com/kobihanoch/Strong-Together-App/commit/a95c4480523b2b11c6e65d53d42b94bf1b72fcdf))

## [4.0.0](https://github.com/kobihanoch/Strong-Together-App/compare/v3.0.0...v4.0.0) (2025-09-29)


### Features

* **Analystics:** Created estimated 1 RM card ([6b766f4](https://github.com/kobihanoch/Strong-Together-App/commit/6b766f47c25319bca1ca9b26b0f440b073daf9c5))
* **Analytics:** Added analytics page with overview card ([ece6204](https://github.com/kobihanoch/Strong-Together-App/commit/ece620441a748a78f857adb62c55297a2d220fc8))
* **Analytics:** Added API fetching ([a630aa1](https://github.com/kobihanoch/Strong-Together-App/commit/a630aa1e434c4a828486fe3114fbcb4b8b922a8f))
* **Analytics:** Added goal adherence card ([8ab34fc](https://github.com/kobihanoch/Strong-Together-App/commit/8ab34fc1a3135b72b520712b021dcfb7ed33789c))
* **Analytics:** Created a render item component to render a 1RM item ([9fbc15e](https://github.com/kobihanoch/Strong-Together-App/commit/9fbc15e3722acc8e17f562098f5cce3da90ab91f))
* **Analytics:** Created an home page button to navigate ([7676c61](https://github.com/kobihanoch/Strong-Together-App/commit/7676c61c20fdbd47d92bccb10e7e4a925da7d111))
* **Analytics:** Created esitamted 1RM card ([c6690f0](https://github.com/kobihanoch/Strong-Together-App/commit/c6690f060139e3d60dce1e90a3ab3b2e6d48ce48))
* **Analytics:** Created modal component to slide up for watching all data ([1829be4](https://github.com/kobihanoch/Strong-Together-App/commit/1829be4378c2f5caea9bb2ac11944a04e92aa2b4))
* **Analytics:** Replace BottomModalFlatlist with SlidingBottomModal for improved UI ([36994c6](https://github.com/kobihanoch/Strong-Together-App/commit/36994c6d45f158862ff70309a2c09d5f86e3a726))
* **Analytics:** Sliding modals are now functinoal for adherence and 1rms ([458d1d6](https://github.com/kobihanoch/Strong-Together-App/commit/458d1d6767177b87f569debdc351fe9432d504dc))
* **Anayltics:** Polished UI for overview card and added workout plan details ([07fa99a](https://github.com/kobihanoch/Strong-Together-App/commit/07fa99ae8305a08eb351d59ded425f73cfa8a262))
* **Api:** Create bootstrap API to reduce 5 different fetches for 5 contexes into 1 boottrap fetch. No changes to hook - only unite the requests into one promise only in first fetch ([e4800e8](https://github.com/kobihanoch/Strong-Together-App/commit/e4800e8c983f33edc604b99ba551df70fe2328b1))
* **Auth:** Added remove cache funciotnality when refresh fails at start. Backend is using token version for multi-device usage (against client cache) ([323a9d5](https://github.com/kobihanoch/Strong-Together-App/commit/323a9d583f802b91f8fcea4969dd73e09ec311ab))
* **BottomTabBar:** Increased height ([f0b4964](https://github.com/kobihanoch/Strong-Together-App/commit/f0b4964728177b9b810d09976a639020d9cc7440))
* **Cache:** Added cache to analytics ([268633c](https://github.com/kobihanoch/Strong-Together-App/commit/268633c1b6a0b8f47979346f811f99c61b26e618))
* **Cache:** Caching after finished workout ([8789535](https://github.com/kobihanoch/Strong-Together-App/commit/8789535572d9e49ffe58555979ad443580dda6b0))
* **Cache:** Created a hook for update cache and renew logic for caching (all control inside context in any change) ([f8bfb55](https://github.com/kobihanoch/Strong-Together-App/commit/f8bfb551e82d8ef7fec906322f0a681edfcab01a))
* **Cache:** Created cache for contexes ([725aaa7](https://github.com/kobihanoch/Strong-Together-App/commit/725aaa782b80f6acaec7cb1ad204ce92516451fc))
* **Cache:** Export cache logic to hook for analysisContext ([311680a](https://github.com/kobihanoch/Strong-Together-App/commit/311680a09229dad6b2c1fac77dca2c87228784a4))
* **Cache:** Implement cache deletion for analytics in workout context and start workout logic ([7a47559](https://github.com/kobihanoch/Strong-Together-App/commit/7a47559e174febdc78c0014876a868244a2b15fe))
* **Cache:** Implement cache housekeeping on app boot to remove outdated cache entries ([07a2475](https://github.com/kobihanoch/Strong-Together-App/commit/07a24755783533de8f6e3e10818b7158268ca30d))
* **Cache:** New UI fast load for cached user and late server validation of tokens ([363ac0e](https://github.com/kobihanoch/Strong-Together-App/commit/363ac0e402d263dee405009db73d8058580938a4))
* **Cache:** Update caching logic to automate storage in Analysis, Notifications, and Workout contexts ([c36cb87](https://github.com/kobihanoch/Strong-Together-App/commit/c36cb8704151cf6f5c5a89c88a4aad267e316a28))
* **Cardio:** Created cardio context ([bd42ae7](https://github.com/kobihanoch/Strong-Together-App/commit/bd42ae7b2dad24c6429d33f38f459abfa8e99ba3))
* **Cardio:** New log system ([69d9230](https://github.com/kobihanoch/Strong-Together-App/commit/69d92308343f5f8bf940b8e102639257bcadbe15))
* **Components:** Created a sliding bottom modal component ([b44594e](https://github.com/kobihanoch/Strong-Together-App/commit/b44594e68f62981153126bc3c2d18975ed09061c))
* **CreateWorkout:** Added a search bar ([48e12f2](https://github.com/kobihanoch/Strong-Together-App/commit/48e12f2fe4445b0fbf9d552763938af0e35bd0af))
* **CreateWorkout:** Created workout is fully refactored with new UI and more optimized ([d02c8b2](https://github.com/kobihanoch/Strong-Together-App/commit/d02c8b2aeb67c7e7e8d6ab9cdc1fde3e0d15426f))
* **CreateWorkout:** Used new bottom modal ([7403b82](https://github.com/kobihanoch/Strong-Together-App/commit/7403b82ea21d62e8e8bae8c3ae80215fb0ba4a2b))
* **Home:** Added auto-incerement animation component ([e93a6e7](https://github.com/kobihanoch/Strong-Together-App/commit/e93a6e7f626ecf9711d5deadbbda7e9b8bc83b55))
* **Home:** Created a new card for quick start ([dd74552](https://github.com/kobihanoch/Strong-Together-App/commit/dd7455279a8251d011e212d85fd9114f0f738fcc))
* **Home:** Created PR card ([0585dd3](https://github.com/kobihanoch/Strong-Together-App/commit/0585dd3da46aed24f1ce290714372e5114c88b4f))
* **Home:** Created quick actions card ([838451a](https://github.com/kobihanoch/Strong-Together-App/commit/838451a803d9c6e29cfcb1dd9b788d397a7231f6))
* **Home:** Implmemented skelatons and null guards ([6c64f16](https://github.com/kobihanoch/Strong-Together-App/commit/6c64f16a852fa970fd3b621aaf59f9da1e20395f))
* **Home:** integrate loading skeletons for better UX during data fetching; ([dedf46c](https://github.com/kobihanoch/Strong-Together-App/commit/dedf46c6a8aacd9d51db8160cd8cb1155a6dc7c3))
* **Inbox:** Optimized flatlist of messages with react memoization ([166a468](https://github.com/kobihanoch/Strong-Together-App/commit/166a468ea0bb3c477b65483151a6443be74f129d))
* **Intro:** Added privacy policy ([7cd712f](https://github.com/kobihanoch/Strong-Together-App/commit/7cd712f593905cb5ddc0d34b456648ae5b493996))
* **Intro:** Changed gender selection into a list ([75a4404](https://github.com/kobihanoch/Strong-Together-App/commit/75a4404402d162da0b0e1576475d8aae842fc6ce))
* **MyWorkoutPlan:** Added a hook to handle light status bar ([a3618d1](https://github.com/kobihanoch/Strong-Together-App/commit/a3618d1829906e970c2aa1fe8942c83e6e4c716e))
* **MyWorkoutPlan:** Refactored UI ([af2bebd](https://github.com/kobihanoch/Strong-Together-App/commit/af2bebd5365a17dccdaea88101ab182447ee2ad1))
* **Navigation:** Disable navigation on app loading ([fa42f17](https://github.com/kobihanoch/Strong-Together-App/commit/fa42f174070dbb326afa7108fb3c3fe844521a74))
* **Network:** Added a hook that lisntenes to network state changes and updates user online/offline ([f648a04](https://github.com/kobihanoch/Strong-Together-App/commit/f648a042a73d685b50ea80df74eb9204faf41266))
* **Network:** Offline cache-login is fully implemented and working ([668266a](https://github.com/kobihanoch/Strong-Together-App/commit/668266aacd636773bf813e03ac2a21828830f8d7))
* **Network:** Server error is logging out user, network error keeps and shows offline message ([0c22551](https://github.com/kobihanoch/Strong-Together-App/commit/0c2255194cb06009d268b520fc40c21c58bfa981))
* **Notifications:** Add flag for non-duplicate caching at startup ([77716cc](https://github.com/kobihanoch/Strong-Together-App/commit/77716cc5c8084148319321ddefd9f912db837599))
* **Notifications:** Implement write-through caching for messages and senders ([5750454](https://github.com/kobihanoch/Strong-Together-App/commit/57504540101404afe35c0da91afcbfab43f50075))
* **Packages:** Add @gorhom/bottom-sheet dependency and update babel config plugins ([cd7940e](https://github.com/kobihanoch/Strong-Together-App/commit/cd7940e579d7d6b7268bd0cfb3b2fa2503298d22))
* **Profile:** Added edit profile modal ([c6c5e9e](https://github.com/kobihanoch/Strong-Together-App/commit/c6c5e9eeb0ed5f615e6a4fcfd32ef5a86ec38066))
* **Profile:** Added option to delete self account ([5bc6cad](https://github.com/kobihanoch/Strong-Together-App/commit/5bc6cadbe74be26266c056c413665d885897705c))
* **Profile:** Profile editing is now fully implemented ([f93d417](https://github.com/kobihanoch/Strong-Together-App/commit/f93d4179c0922cdab80fe7866a5d35c3caa4ee5e))
* **SlidingModal:** Added blur ([e97c66c](https://github.com/kobihanoch/Strong-Together-App/commit/e97c66c82a400571f17f62d33288bdb01a5f05ee))
* **StartWorkout:** Added a dialog on start up for resume workout ([4c6b3cb](https://github.com/kobihanoch/Strong-Together-App/commit/4c6b3cb3a8dcadfa94ceaacaf620bc3a18d4c222))
* **StartWorkout:** Added a hook to manage cache workout process for proccess terminating at prod ([f74dbbd](https://github.com/kobihanoch/Strong-Together-App/commit/f74dbbd1bf1795fe8e3cf550d269411a065b8c33))
* **StartWorkout:** Added current timer state cache on pausing ([72e10e6](https://github.com/kobihanoch/Strong-Together-App/commit/72e10e6b267f1fa05e495ea4870b9edbfadca78e))
* **StartWorkout:** Added debounce cache and cache recovery for interuptted workouts ([0703d5a](https://github.com/kobihanoch/Strong-Together-App/commit/0703d5a3b0ad1ca9978216a771c22005da78041a))
* **StartWorkout:** Added immediate caching when app state is canging ([414abd1](https://github.com/kobihanoch/Strong-Together-App/commit/414abd17baaf307177d235bc62326583050bbc4e))
* **StartWorkout:** Bottom tab bar components is now unvisible at workout mode, instead creating a unique bottom tab bar for this screen ([24e11fd](https://github.com/kobihanoch/Strong-Together-App/commit/24e11fd35504760ad2a5e4f1f67a4bb1797098dd))
* **StartWorkout:** Changed keyboard type for reps to number pad ([04d64e9](https://github.com/kobihanoch/Strong-Together-App/commit/04d64e976f892de181a823791db83eb132db0a30))
* **StartWorkout:** Created timer component and refactored whole structure (UI and logic) ([ed45558](https://github.com/kobihanoch/Strong-Together-App/commit/ed4555886780b499c0017ce4ddce651947d8dd51))
* **StartWorkout:** New UI ([63b019f](https://github.com/kobihanoch/Strong-Together-App/commit/63b019f80ea3c3dc1c810feb9a6c47736ebce6a4))
* **Statistics:** Added a "today" button to calendar strip to scroll to today ([724dc03](https://github.com/kobihanoch/Strong-Together-App/commit/724dc0335a0f23814e351e917473dea7655108dd))
* **Statistics:** Added a dot to indicate if current day has cardio activity or not ([0882f03](https://github.com/kobihanoch/Strong-Together-App/commit/0882f036615974fc6a55d40ead4d3bfbc15a74e0))
* **Statistics:** Added a weekly chart of cardio ([5cba4a4](https://github.com/kobihanoch/Strong-Together-App/commit/5cba4a4c1020fe23833fa866788b716c2d6a9ea8))
* **Statistics:** Added new UI for rest day card ([f727cb2](https://github.com/kobihanoch/Strong-Together-App/commit/f727cb200d70ec35dea2d69d00daa00e8066a43e))
* **Statistics:** Created new exercise-statistics segment screen ([cd29cf6](https://github.com/kobihanoch/Strong-Together-App/commit/cd29cf61a72363c44641abc7e622e838e5abe077))
* **Statistics:** Fetching PR from server ([2cf8542](https://github.com/kobihanoch/Strong-Together-App/commit/2cf8542b408c594e6c12b264b07388dc2840b60a))
* **Statistics:** User can now watch notes written for exercise during workout ([c3ed96e](https://github.com/kobihanoch/Strong-Together-App/commit/c3ed96ebe89335f410acbb3dd77a2257bd721fad))
* **WorkoutMode:** Applied new modal ([ad4fd4f](https://github.com/kobihanoch/Strong-Together-App/commit/ad4fd4f672da1e3424ecbdc1d448b7a46330f451))
* **WorkoutMode:** Polished UI ([32e7c0b](https://github.com/kobihanoch/Strong-Together-App/commit/32e7c0b43906ad295b0a38352a383ed3affec3b6))


### Bug Fixes

* **Analysis:** Fix data fetching from API on cache hook ([0b0e9ac](https://github.com/kobihanoch/Strong-Together-App/commit/0b0e9ac31a8b73f57cb1c7e83a9d2249586d4c20))
* **Analytics:** Shows no data label when no workout history is available ([19d9139](https://github.com/kobihanoch/Strong-Together-App/commit/19d9139d8de6b21e55f9ca4e567658ea2212e99a))
* **Auth:** Fixed login jump ([4d43393](https://github.com/kobihanoch/Strong-Together-App/commit/4d433933a6d5e82077cd2e3c1f38f3706ca46701))
* **Auth:** Initiliaze socket connection after caching ([efe3f09](https://github.com/kobihanoch/Strong-Together-App/commit/efe3f095b7cc269206297ceb48d74c9dcd7f8695))
* **Cache:** Fixed API and cache data writing race ([a7b9565](https://github.com/kobihanoch/Strong-Together-App/commit/a7b95651c40afe6f4b7f5ffba35cee1ff6290fc9))
* **Cache:** Fixed API fetching twice on logging in ([d646a37](https://github.com/kobihanoch/Strong-Together-App/commit/d646a3775639fbc09879f3ac61509f662c23c892))
* **Icons:** Fixed icons showing question mark on load ([e48a4fe](https://github.com/kobihanoch/Strong-Together-App/commit/e48a4fe2d3c35e29c5fd14ac8c5db73bade4f379))
* **Intro:** Fixed invisible icons (unsupported font awesome library) ([a60f83b](https://github.com/kobihanoch/Strong-Together-App/commit/a60f83bec43caac6ddf98f9964b5c2ca302b155c))
* **Load:** Fixed load flash for a milisecond of auth stack when authenticated ([0af65f6](https://github.com/kobihanoch/Strong-Together-App/commit/0af65f6f9cdf9b2ba2c97d1868b06018e4dde1ae))
* **Loading:** FIxed flash of loading at login ([a5ec4b1](https://github.com/kobihanoch/Strong-Together-App/commit/a5ec4b10298aa07000893cdb6dd5c5a6874e1024))
* **OfflineMode:** Removed logging out on network error in logging in ([ad1dc87](https://github.com/kobihanoch/Strong-Together-App/commit/ad1dc878d400ea5d2fce7510fa91109c229e5f70))
* **ProfileImage:** Fixed uploading an image ([ec30489](https://github.com/kobihanoch/Strong-Together-App/commit/ec3048944ba6d34b30423543ff09b2077496fa2b))
* **StartWOrkout:** Fixed clear cache on save workout ([309740e](https://github.com/kobihanoch/Strong-Together-App/commit/309740e0f28792ce4473728ecf09ceaec1dc39ab))
* **StartWorkout:** Fixed null destructing ([7adbeab](https://github.com/kobihanoch/Strong-Together-App/commit/7adbeabe7c3dbdee67e9b602f224044cf5b0cc3a))
* **StartWorkout:** Force unmount by navigation.replace on quitting to handle old workouts data bugs ([d17f9c7](https://github.com/kobihanoch/Strong-Together-App/commit/d17f9c79bd99bcefb56bd360e92f70bfbe1ea986))

## [3.0.0](https://github.com/kobihanoch/Strong-Together-App/compare/v2.12.0...v3.0.0) (2025-08-19)


### Features

* **Alerts:** Integrate react-native-alert-notification for enhanced dialog prompts across the application ([be4be03](https://github.com/kobihanoch/Strong-Together-App/commit/be4be032c4fbe9fbaeb5aa0b4be45952704d88bf))
* **Api:** Create an API instance ([25abfcf](https://github.com/kobihanoch/Strong-Together-App/commit/25abfcf80bf48d832c86d02ef2462d1ffb30efe1))
* **App:** Wrap main application in GestureHandlerRootView for gesture handling support (for error alerts) ([bb8f4d1](https://github.com/kobihanoch/Strong-Together-App/commit/bb8f4d1f6c3ee394b063aada8e86766229d68b33))
* **Auth:** Implement token refresh mechanism and improve error handling ([1133729](https://github.com/kobihanoch/Strong-Together-App/commit/1133729f7cfeecf6ca3fa9b3f49c4e018845dc5f))
* **Auth:** New auto session intializer is functional ([399707b](https://github.com/kobihanoch/Strong-Together-App/commit/399707bf8e1b8d49e6ac6bbbd5c3555df3644cbc))
* **Auth:** New log in is functional ([8c64df2](https://github.com/kobihanoch/Strong-Together-App/commit/8c64df22dfa5164ca5ed4f82e4828bf6f109844d))
* **Auth:** New log out is functional ([bc20fbf](https://github.com/kobihanoch/Strong-Together-App/commit/bc20fbfe870d33cbf55bae51006e6305d4469455))
* **Auth:** Register is depeneded on login (callback) ([6c5d3cc](https://github.com/kobihanoch/Strong-Together-App/commit/6c5d3cca002d38a6fda59b13a1cc2fb61faa7827))
* **Auth:** Update exercise tracking fetching method to use new API endpoint ([071c913](https://github.com/kobihanoch/Strong-Together-App/commit/071c913d390c10e79b5c0b728c8a5faf76c49e5e))
* **Auth:** Use useMemo in context ([a77db6d](https://github.com/kobihanoch/Strong-Together-App/commit/a77db6d90ea22c059b8798bb4e04ae6a9685863a))
* **Context:** Created analysis context ([e6c659a](https://github.com/kobihanoch/Strong-Together-App/commit/e6c659a82ecaca29920e33bc6ae44e033f8ef1f0))
* **Context:** New workout context ([be10eb3](https://github.com/kobihanoch/Strong-Together-App/commit/be10eb3aadac520d75be757200baad07eccb2ed8))
* **CreateWorkout:** Added an exercise picker for adding new exercises ([1768178](https://github.com/kobihanoch/Strong-Together-App/commit/17681787676201c54b7bc9fe32d0f037170c260e))
* **CreateWorkout:** Added drag to exercises ([3c49cc9](https://github.com/kobihanoch/Strong-Together-App/commit/3c49cc95907ed276436906fbc26a5b5297f3dc1e))
* **CreateWorkout:** Created / Edit workout is fully functional ([b517ecf](https://github.com/kobihanoch/Strong-Together-App/commit/b517ecf680d81483bb9e58597747b37c89508b09))
* **CreateWorkout:** User can delete exercises ([8efd3ef](https://github.com/kobihanoch/Strong-Together-App/commit/8efd3ef868e2ae004d48a109c80721704beda256))
* **CreateWorkout:** User can now add splits or remove splits ([3d2de18](https://github.com/kobihanoch/Strong-Together-App/commit/3d2de18109c11926653319d7f2e9d76cee3297ab))
* **CreateWorkout:** User now can edit sets and reps ([c2e1d5c](https://github.com/kobihanoch/Strong-Together-App/commit/c2e1d5c62de4df0075629cf2337ea9452ab270b8))
* **Errors:** Added notification for network errors ([3a33999](https://github.com/kobihanoch/Strong-Together-App/commit/3a339991cb283fbc13657d2cc78b8cd206a7b2e0))
* **Errors:** Integrate react-native-notifier for error alerts and remove Validators component ([7eba759](https://github.com/kobihanoch/Strong-Together-App/commit/7eba759c7f5c4adb91f4d429bde9a772cee0aa69))
* **ExerciseCard:** Use useMemo ([fc94170](https://github.com/kobihanoch/Strong-Together-App/commit/fc9417033a07579a6fbcf64d5ce3108ce74bcd13))
* **FinishWorkout:** Workout save new endpoint impletantion and save to cache ([1d65ffc](https://github.com/kobihanoch/Strong-Together-App/commit/1d65ffc9b89b3a6f70beb90cc1af0b7e9608b281))
* **HomeData:** Home data is now genrated at the server ([f8f2ef6](https://github.com/kobihanoch/Strong-Together-App/commit/f8f2ef6d54fa5c4615e9daf6ad5d8427ddef2a76))
* **Home:** Make sure home page doesnt start animating before loading has finished ([853dcbc](https://github.com/kobihanoch/Strong-Together-App/commit/853dcbc0145bd96522710516480393333f012582))
* **Images:** Caching images with expo-image for better image loading ([354a949](https://github.com/kobihanoch/Strong-Together-App/commit/354a949a6dc56dec29aa9ce28d81d942f09e720a))
* **Loading:** Add MainLoadingScreen component for improved session loading experience ([24bbd65](https://github.com/kobihanoch/Strong-Together-App/commit/24bbd65a7e0f97197166bbae8cde726050fa685b))
* **Media:** Use a smaller PNG for logo for faster loading ([847803f](https://github.com/kobihanoch/Strong-Together-App/commit/847803ff012bda1730458f61c8427cb3f6c4ddc9))
* **Messages:** Add message deletion functionality to update received messages ([3ae8119](https://github.com/kobihanoch/Strong-Together-App/commit/3ae8119959d22177bcf36d1df5c3661d6a4c38c8))
* **Messages:** New implementation for read messages ([76ca94b](https://github.com/kobihanoch/Strong-Together-App/commit/76ca94bffcfac1ba49525843ba6d4f8a07a8ab72))
* **Messages:** Use useMemo in context ([fd090cf](https://github.com/kobihanoch/Strong-Together-App/commit/fd090cf36b5b89f03898dd90706dbdf724b81236))
* **MyWorkoutPlan:** Fetch on load how much performences for each split ([41c92ab](https://github.com/kobihanoch/Strong-Together-App/commit/41c92ab35435c10c669e313ed8e8d8171d1430f4))
* **MyWorkputPlan:** Use useMemo and useCallback ([27fab19](https://github.com/kobihanoch/Strong-Together-App/commit/27fab19b23729e270dd618bfe367ce5f670fc0de))
* **Notifications:** Add message listener to handle incoming messages ([2db3ea3](https://github.com/kobihanoch/Strong-Together-App/commit/2db3ea3f4b1e92720f173de734c3f2f39b9c5284))
* **Notifications:** New get all users messages ([0f2b822](https://github.com/kobihanoch/Strong-Together-App/commit/0f2b8226c1bdd073a025efff43f92fe525d17c01))
* **Notifications:** New get messages from server for user ([4a2b251](https://github.com/kobihanoch/Strong-Together-App/commit/4a2b251e0a9617a866aaa71b44e13a11e5148b95))
* **Notifications:** Refactor notification setup and remove unused manager ([5702ac9](https://github.com/kobihanoch/Strong-Together-App/commit/5702ac9235b0ebe7ed72f6e46bd6b56d69059472))
* **Package:** Add react-native-notifier dependency ([6f73e9a](https://github.com/kobihanoch/Strong-Together-App/commit/6f73e9ac16a61d73dba991c16a02bdd7c9d33eb7))
* **ProfileImage:** Integrate API for deleting profile pictures and refactor state management ([4a55f78](https://github.com/kobihanoch/Strong-Together-App/commit/4a55f7830b110f108465aeeb9455c1dc28a989c3))
* **ProfileImage:** New endpoints and functions to set profile pic ([6fd3f99](https://github.com/kobihanoch/Strong-Together-App/commit/6fd3f99a1b1c2d18b959109834257f60173d5877))
* **Profile:** Optimized using useMemo ([32d272a](https://github.com/kobihanoch/Strong-Together-App/commit/32d272a02283fee3be7d25e1641622c525206711))
* **Registration:** Registration implemented ([30ab88d](https://github.com/kobihanoch/Strong-Together-App/commit/30ab88dd6a96eefba0d70aea6b5a0ca0af3f387d))
* **Settings:** Notifications permission request with toggle ([7fd481b](https://github.com/kobihanoch/Strong-Together-App/commit/7fd481ba0d7524f2c7aaa42a3dc0793803f9c77c))
* **Socket:** Implement socket connection and disconnection handling ([e6e762a](https://github.com/kobihanoch/Strong-Together-App/commit/e6e762a2cb2a31daaafa000b244aebe66d5e8b51))
* **Socket:** Updated socket config ([687f421](https://github.com/kobihanoch/Strong-Together-App/commit/687f4211d874fe3d5733f3c2f81c0eca9c1c3e9c))
* **Statistics:** Builds an exercisetracking map by dates every time exercisetracking is changed, for better filtering O(1) instead of O(n) ([367e87b](https://github.com/kobihanoch/Strong-Together-App/commit/367e87b9f7eb149c9d9069fc5a1e5bbf012c55ff))
* **Statistics:** Refactor filterExercisesByDate to improve readability and performance ([5b05b6c](https://github.com/kobihanoch/Strong-Together-App/commit/5b05b6cca28e0a8f351d7efa2a799057245537ed))
* **Statistics:** Sort array with order index to show statistics ([2fe6d4d](https://github.com/kobihanoch/Strong-Together-App/commit/2fe6d4dee8024836545d59cc49fcdfc94ba7d42c))
* **Statistics:** Update exerciseTracking prop to handle null values and improve date formatting in useStatisticsPageLogic ([6799dd3](https://github.com/kobihanoch/Strong-Together-App/commit/6799dd3318253a8db647a979e6ffbfbd942d2308))
* **Statistics:** Use useMemo for better user experience ([4caf584](https://github.com/kobihanoch/Strong-Together-App/commit/4caf584b319fc6139cd8c36a2c9cb2c8122ac5e9))
* **UseExercises:** New API call to fetch all exercises inDB ([6d6be05](https://github.com/kobihanoch/Strong-Together-App/commit/6d6be05591eef6132194dc5b525a0d16d8b70fec))
* **Utils:** New util to extract workout splits from workout ([6941c5f](https://github.com/kobihanoch/Strong-Together-App/commit/6941c5f71ae20b135de122ab54b135d4ad964585))
* **Workout:** In workout mode the progress for each exercise is comapred to last performence ([505ca81](https://github.com/kobihanoch/Strong-Together-App/commit/505ca812300f630685251ceec8de502c676f26e1))
* **Workouts:** New fetching method for user's workout plan ([4aa7c18](https://github.com/kobihanoch/Strong-Together-App/commit/4aa7c1834cd51968b5154aabb1c06ddde080471c))
* **Workout:** Update realtime analysis at end of workout ([6de0dcd](https://github.com/kobihanoch/Strong-Together-App/commit/6de0dcd7a6ab85937d0146de6326c2c0b45dafe7))


### Bug Fixes

* **AuthContext:** Fixed refresh token deleting on log out ([efb41af](https://github.com/kobihanoch/Strong-Together-App/commit/efb41af4b2688c3e5b50d3ffede88908f6a0aa58))
* **Auth:** FIxed unable to login with new contexes ([78bc8bd](https://github.com/kobihanoch/Strong-Together-App/commit/78bc8bd3c3ff9335e8722fcfa86da0b8c361696f))
* **Auth:** Improve logout handling by resetting loading states ([97a4e27](https://github.com/kobihanoch/Strong-Together-App/commit/97a4e27ebbde4cdf92be4da1cf8f5e4dfbb601b5))
* **Auth:** Refresh tokens and access tokens are now handled weel - with secure better session managment. ([78e9325](https://github.com/kobihanoch/Strong-Together-App/commit/78e9325ec72f1e2490ade5b9ebbcaf36d9869da5))
* **Errors:** Ensure error messages are displayed for all response errors ([ef7f2f3](https://github.com/kobihanoch/Strong-Together-App/commit/ef7f2f38feb7ab37a3fde985de94120df161497b))
* **ExerciseCard:** Fixed UI colors for PR and improved ([108d845](https://github.com/kobihanoch/Strong-Together-App/commit/108d845277421cc6ddba23fc911b7571bf8fac9e))
* **FinishWorkout:** Update finished workout in cache ([969458e](https://github.com/kobihanoch/Strong-Together-App/commit/969458e54d1ec87ce8b9a146f82ce1327960b005))
* **Inbox:** Ensure unread messages are removed when a message is deleted ([97e71d1](https://github.com/kobihanoch/Strong-Together-App/commit/97e71d1c23a4e22cf823d8e265dd5d7ad8898b1c))
* **Inbox:** FIxed sender full name is showing undefined ([ef0617e](https://github.com/kobihanoch/Strong-Together-App/commit/ef0617e3d9be5ceb6a3e14c4ecf3b1562191d13e))
* **Inbox:** Removed setUnreadMessages ([d789212](https://github.com/kobihanoch/Strong-Together-App/commit/d78921252e239768fab9dfe024ea2efcd1a653d9))
* **LastWorkout:** Parse to number exercise id to avoid exception ([212220e](https://github.com/kobihanoch/Strong-Together-App/commit/212220e8cc84f4c788a537b06c8ae2303ba68b88))
* **Logout:** Logout is performing clean now ([3e7e00a](https://github.com/kobihanoch/Strong-Together-App/commit/3e7e00a7ba19121b834890de7aba433041b67c47))
* **Messages:** Live messages is now fixed ([d4f81c2](https://github.com/kobihanoch/Strong-Together-App/commit/d4f81c2f6e4bfb391c040ec612d7b86136e37e21))
* **Messages:** Message is now updating in live when read ([92ad531](https://github.com/kobihanoch/Strong-Together-App/commit/92ad5312434a5b82ad41eb358291196df0d09f50))
* **MyWorkoutPlan:** Show 0 where there is no performence count for current split ([be43b89](https://github.com/kobihanoch/Strong-Together-App/commit/be43b893e12b6f0928d27829bf512eab3f0858d2))
* **NavBar:** Fixed navigation ([4e51d03](https://github.com/kobihanoch/Strong-Together-App/commit/4e51d03fe92d83c6c34fe69714a5e36a34867254))
* **NotificationsContext:** Update profile image URL handling to use public storage path ([b35bb5f](https://github.com/kobihanoch/Strong-Together-App/commit/b35bb5fec1df7081e8fd51eb8db6cd00035690f4))
* **ProfileImage:** Modal is now opened correctly ([b70a98d](https://github.com/kobihanoch/Strong-Together-App/commit/b70a98d840147ec90d0094d8e407c10e25946d37))
* **SetItem:** Remove commented code in handleRepsChange for clarity ([c5e5072](https://github.com/kobihanoch/Strong-Together-App/commit/c5e50724f30100ec8e9290482ad8a0b545616b45))
* **StartWorkout:** Fixed uexpected behavior ([34d32cc](https://github.com/kobihanoch/Strong-Together-App/commit/34d32cc4b6b786c679a82cdf4f15a56af50a1cb1))
* **Utils:** Extract workout splits is not protected from null workout splits (if a user has a workout but no wotkout splits - cant happen realy) ([cb0867f](https://github.com/kobihanoch/Strong-Together-App/commit/cb0867f134fe2503e86c02c12599d63cf8c9f38f))
* **Workout:** Fixed crashing where no older data to show for last workout ([dcb2403](https://github.com/kobihanoch/Strong-Together-App/commit/dcb240350adf3ffdfab7e7a79af4b22ed174351e))

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
