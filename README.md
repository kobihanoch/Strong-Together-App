# 💪 Strong Together

**Strong Together** is a personal fitness tracking app built with React Native and Expo.  
It allows users to manage workout plans, track sets and weights, receive messages, and get real-time push notifications — all in a modern, smooth user interface.

---

## 🚀 Features

- 📅 Create and manage personalized workout plans
- 🏋️ Log sets, reps, and weight with smart tracking
- 📈 View post-workout summaries and progress analytics
- 🔔 Get notified about new messages or reminders
- 🎨 Smooth and modern mobile UI

---

## 🛠️ Tech Stack

- ⚛️ [React Native](https://reactnative.dev/)

- 📦 [Expo](https://expo.dev/)

- 🧱 [Supabase](https://supabase.com/) – Database, Auth, and Realtime features

---

## ⚙️ Local Setup

```
# 1. Clone the repository
git clone https://github.com/kobihanocht/strong-together.git

# 2. Navigate into the project directory
cd strong-together

# 3. Install dependencies
npm install

# 4. Launch the app
npx expo start

```

---

## Folder Structure

```
	📁 components/                   # 🧩 UI components (general + screen-specific)
	│   ┣ 📂 CreateWorkoutComponents/
	│   ┣ 📂 HomeComponents/
	│   ┣ 📂 MyWorkoutPlanComponents/
	│   ┣ 📂 ProfileComponents/
	│   ┣ 📂 StartWorkoutComponents/
	│   ┣ 📂 StatisticsComponents/
	│   ┣ 📄 BottomTabBar.js
	│   ┣ 📄 CountdownComponent.js
	│   ┣ 📄 GradientedGoToButton.js
	│   ┣ 📄 InputField.js
	│   ┣ 📄 LoadingPage.js
	│   ┣ 📄 Logo.js
	│   ┣ 📄 PageIndicator.js
	│   ┣ 📄 Theme1.js
	│   ┣ 📄 ToggleSetting.js
	│   ┣ 📄 TopComponent.js
	│   ┗ 📄 Validators.js

	📁 context/            # 🧠 React context providers
	│   ┣ 📄 AuthContext.js
	│   ┗ 📄 NotificationsContext.js

	📁 hooks/                       # 🧲 Custom hooks
	│   ┣ 📁 logic/                 # 📌 Screen-specific logic
	│   │   ┣ 📄 useHomePageLogic.js
	│   │   ┣ 📄 useProfilePageLogic.js
	│   │   ┣ 📄 useStartWorkoutPageLogic.js
	│   │   ┣ 📄 useStatisticsPageLogic.js
	│   │   ┗ 📄 useMyWorkoutPlanPageLogic.js
	│   ┣ 📄 useDeleteWorkout.js
	│   ┣ 📄 useExercises.js
	│   ┣ 📄 useMediaUploads.js
	│   ┣ 📄 useSplitExercises.js
	│   ┣ 📄 useUserData.js
	│   ┣ 📄 useUserWorkout.js
	│   ┣ 📄 useWorkouts.js
	│   ┗ 📄 useWorkoutSplits.js

	📁 navigation/      # 🧭 Navigation stacks
	│   ┣ 📄 AppStack.js
	│   ┗ 📄 AuthStack.js

	📁 notifications/               # 🔔 Push notification logic
	│   ┣ 📄 NotificationsManager.js
	│   ┗ 📄 NotificationsSetup.js

	📁 screens/                 # 📱 App screens
	│   ┣ 📄 CreateWorkout.js
	│   ┣ 📄 Home.js
	│   ┣ 📄 Intro.js
	│   ┣ 📄 LogIn.js
	│   ┣ 📄 MyWorkoutPlan.js
	│   ┣ 📄 Profile.js
	│   ┣ 📄 Register.js
	│   ┣ 📄 Settings.js
	│   ┣ 📄 StartWorkout.js
	│   ┗ 📄 Statistics.js

	📁 services/           # 🛠️ Supabase service logic
	│   ┣ 📄 AuthService.js
	│   ┣ 📄 ExercisesService.js
	│   ┣ 📄 ExerciseTrackingService.js
	│   ┣ 📄 MediaService.js
	│   ┣ 📄 SplitExerciseService.js
	│   ┣ 📄 UserService.js
	│   ┣ 📄 WorkoutService.js
	│   ┗ 📄 WorkoutSplitsService.js

	📁 utils/              # 🔧 Helper functions
	│   ┣ 📄 authUtils.js
	│   ┣ 📄 homePageUtils.js
	│   ┣ 📄 myWorkoutPlanUtils.js
	│   ┣ 📄 profilePageUtils.js
	│   ┣ 📄 realTimeUtils.js
	│   ┣ 📄 startWorkoutUtils.js
	│   ┗ 📄 statisticsUtils.js

	📁 src/
	│	┣ 📄 supabaseClient.js     # 🔌 Supabase client instance


```

---

# Screenshots

- Add in the future

---
