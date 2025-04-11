# 🌟 Strong-Together-App 🌟

![Fitness App](https://img.shields.io/badge/Fitness-App-blue) ![JavaScript](https://img.shields.io/badge/Made%20With-JavaScript-yellow) ![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)

**Strong-Together-App** is a fitness application designed to empower users to achieve their health and fitness goals through personalized workout programs, progress tracking, and a supportive community.

---

## 🚀 Features

- **Personalized Fitness Plans**: Tailored to individual goals.
- **Progress Tracking**: Monitor achievements and milestones.
- **Community Support**: Connect with like-minded individuals.
- **User-Friendly Interface**: Simple and intuitive design.

---

## 🛠️ Tech Stack

- ⚛️ [React Native](https://reactnative.dev/)

- 📦 [Expo](https://expo.dev/)

- 🧱 [Supabase](https://supabase.com/) – Database, Auth, and Realtime features

---

## 🖥️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kobihanoch/Strong-Together-App.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Strong-Together-App
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the application:
   ```bash
   npm start
   ```

---

## 🗄️ Database Schema

Below is the database schema for the application:

![Database Diagram](assets/dbdiagram.png)

---

## Folder Structure

```
📁 components/               # 🧩 UI components (general + screen-specific)
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

📁 context/                 # 🧠 React context providers
│   ┣ 📄 AuthContext.js
│   ┗ 📄 NotificationsContext.js

📁 hooks/                   # 🧲 Custom hooks
│   ┣ 📁 logic/               # 📌 Screen-specific logic
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

📁 navigation/              # 🧭 Navigation stacks
│   ┣ 📄 AppStack.js
│   ┗ 📄 AuthStack.js

📁 notifications/           # 🔔 Push notification logic
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

📁 services/                # 🛠️ Supabase service logic
│   ┣ 📄 AuthService.js
│   ┣ 📄 ExercisesService.js
│   ┣ 📄 ExerciseTrackingService.js
│   ┣ 📄 MediaService.js
│   ┣ 📄 SplitExerciseService.js
│   ┣ 📄 UserService.js
│   ┣ 📄 WorkoutService.js
│   ┗ 📄 WorkoutSplitsService.js

📁 utils/                   # 🔧 Helper functions
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

# Screenshots

- Add in the future

---

## 🌐 Contact

For questions or support, please reach out to [kobihanoch](https://github.com/kobihanoch).

---

⭐ If you like this project, don't forget to give it a star!
