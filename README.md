# 🌟 Strong-Together-App 🌟

![Fitness App](https://img.shields.io/badge/Fitness-App-blue) ![JavaScript](https://img.shields.io/badge/Made%20With-JavaScript-yellow) ![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)

<p align="center">
  <img src="assets/app_banner.png" alt="Strong-Together-App Banner" width="100%" />
</p>

**Strong-Together-App** is the ultimate fitness companion designed to help users achieve their health and fitness goals. From personalized workout plans to real-time progress tracking, this app makes fitness accessible, engaging, and rewarding.

---

## 🏋️ About Strong-Together-App

The aim of **Strong-Together-App** is to create a seamless fitness platform that combines innovative technology and fitness best practices to:

- **Simplify Workouts**: Provide users with personalized and manageable workout plans.
- **Track Progress**: Monitor user achievements to keep them motivated.
- **Foster Engagement**: Offer in-app tools like notifications and future community options to maintain consistent engagement.
- **Leverage Technology**: Utilize tools like Supabase for real-time data management and React Native for a seamless cross-platform experience.

---

## 🎯 Key Highlights

### 🚀 Core Features

- **Personalized Fitness Plans**: Tailor-made workout plans for every fitness level.
- **Progress Tracking**: Track your exercises, weights, and reps in real time.
- **Push Notifications**: Get reminders and alerts to stay consistent.
- **User-Friendly Interface**: Intuitive and simple design for seamless navigation.

### 💡 Planned Features

- **Community Support**: Create groups, share progress, and participate in challenges.
- **Trainer Mode**: Enable trainers to manage clients with ease.
- **Advanced Analytics**: Gain insights into your fitness journey with detailed reports.

---

## 🛠️ Tech Stack

<p align="center">
  <img src="assets/tech_stack.png" alt="Tech Stack" width="800" />
</p>

#### Frontend

- ⚛️ **React Native**: Cross-platform mobile app development.
- 📦 **Expo**: Simplified development and testing.

#### Backend

- 🧱 **Supabase**: Real-time database, authentication, and hosting.
- **PostgreSQL**: Relational database for structured data storage.

---

## 🖥️ Installation Guide

### ⚡ Quick Start

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kobihanoch/Strong-Together-App.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd Strong-Together-App
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run the Application**:
   ```bash
   npm start
   ```

<p align="center">
  <img src="assets/installation_guide.png" alt="Installation Guide" width="800" />
</p>

---

## 🗄️ Database Schema

The database is designed to handle complex relationships efficiently. Here’s the schema for Strong-Together-App:

<p align="center">
  <img src="assets/dbdiagram.png" alt="Database Schema" width="800" />
</p>

### Key Tables:

- **Users**: Stores user details, preferences, and progress.
- **Workout Plans**: Defines personalized or trainer-assigned plans.
- **Exercises**: Manages individual exercises and their metadata.
- **Tracking**: Logs user progress for each workout session.

---

## 🗂️ Folder Structure

The project is well-organized and modular. Below is a detailed overview of the folder structure:

## 🗂️ Folder Structure

Below is the updated and complete folder structure for **Strong-Together-App**, with detailed descriptions of each folder and file.

| **Folder/File**                       | **Description**                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| 📁 **components/**                    | Contains reusable UI components used across the app.                           |
| ┣ 📂 **CreateWorkoutComponents/**     | Components specific to creating workout plans.                                 |
| ┣ 📂 **HomeComponents/**              | Components for the home screen.                                                |
| ┣ 📂 **MyWorkoutPlanComponents/**     | Components for managing user workout plans.                                    |
| ┣ 📂 **ProfileComponents/**           | Components for the user profile section.                                       |
| ┣ 📂 **StartWorkoutComponents/**      | Components for initiating and tracking workouts.                               |
| ┣ 📂 **StatisticsComponents/**        | Components for displaying user statistics.                                     |
| ┣ 📄 **BottomTabBar.js**              | A custom bottom tab navigation bar.                                            |
| ┣ 📄 **CountdownComponent.js**        | A countdown timer component for workouts.                                      |
| ┣ 📄 **GradientedGoToButton.js**      | A styled button with gradient effects.                                         |
| ┣ 📄 **InputField.js**                | A reusable input field component.                                              |
| ┣ 📄 **LoadingPage.js**               | A loading screen displayed during data fetches.                                |
| ┣ 📄 **Logo.js**                      | The app’s logo component.                                                      |
| ┣ 📄 **PageIndicator.js**             | Displays pagination or steps in a process.                                     |
| ┣ 📄 **Theme1.js**                    | Defines the theme and styles for the app.                                      |
| ┣ 📄 **ToggleSetting.js**             | A toggle switch component for user settings.                                   |
| ┣ 📄 **TopComponent.js**              | A reusable top header component.                                               |
| ┗ 📄 **Validators.js**                | Utility functions for input validation.                                        |
| 📁 **context/**                       | React Context for managing global state like authentication and notifications. |
| ┣ 📄 **AuthContext.js**               | Handles user authentication state.                                             |
| ┗ 📄 **NotificationsContext.js**      | Manages in-app notifications logic.                                            |
| 📁 **hooks/**                         | Custom reusable hooks for logic and API calls.                                 |
| ┣ 📁 **logic/**                       | Screen-specific logic for managing state and behavior.                         |
| ┣ 📄 **useHomePageLogic.js**          | Logic for the home page.                                                       |
| ┣ 📄 **useProfilePageLogic.js**       | Logic for the profile page.                                                    |
| ┣ 📄 **useStartWorkoutPageLogic.js**  | Logic for the start workout page.                                              |
| ┣ 📄 **useStatisticsPageLogic.js**    | Logic for the statistics page.                                                 |
| ┣ 📄 **useMyWorkoutPlanPageLogic.js** | Logic for managing workout plans.                                              |
| ┣ 📄 **useDeleteWorkout.js**          | Handles workout deletion logic.                                                |
| ┣ 📄 **useExercises.js**              | Fetches and manages exercise-related data.                                     |
| ┣ 📄 **useMediaUploads.js**           | Handles media uploads like images or videos.                                   |
| ┣ 📄 **useSplitExercises.js**         | Splits exercises into manageable sections.                                     |
| ┣ 📄 **useUserData.js**               | Fetches and manages user-related data.                                         |
| ┣ 📄 **useUserWorkout.js**            | Fetches and manages user workout data.                                         |
| ┣ 📄 **useWorkouts.js**               | Custom hook for fetching and managing workout plans.                           |
| ┗ 📄 **useWorkoutSplits.js**          | Manages splits in workout routines.                                            |
| 📁 **navigation/**                    | Contains navigation stacks for authenticated and unauthenticated users.        |
| ┣ 📄 **AppStack.js**                  | Navigation for logged-in users.                                                |
| ┗ 📄 **AuthStack.js**                 | Authentication-related navigation flow.                                        |
| 📁 **notifications/**                 | Handles push notifications and notification logic.                             |
| ┣ 📄 **NotificationsManager.js**      | Handles push notification delivery.                                            |
| ┗ 📄 **NotificationsSetup.js**        | Configuration for notifications.                                               |
| 📁 **screens/**                       | Individual screens for the application.                                        |
| ┣ 📄 **CreateWorkout.js**             | Screen for creating workout plans.                                             |
| ┣ 📄 **Home.js**                      | Main home screen with workout summaries.                                       |
| ┣ 📄 **Intro.js**                     | Introductory screen for first-time users.                                      |
| ┣ 📄 **LogIn.js**                     | Login screen for user authentication.                                          |
| ┣ 📄 **MyWorkoutPlan.js**             | Screen for managing and viewing workout plans.                                 |
| ┣ 📄 **Profile.js**                   | User profile screen.                                                           |
| ┣ 📄 **Register.js**                  | Registration screen for new users.                                             |
| ┣ 📄 **Settings.js**                  | Screen for managing user settings.                                             |
| ┣ 📄 **StartWorkout.js**              | Screen for initiating and tracking workouts.                                   |
| ┗ 📄 **Statistics.js**                | Displays user workout statistics and progress.                                 |
| 📁 **services/**                      | Backend service logic for interacting with APIs and databases.                 |
| ┣ 📄 **AuthService.js**               | Handles user authentication requests to Supabase.                              |
| ┣ 📄 **ExercisesService.js**          | Manages API calls related to exercises.                                        |
| ┣ 📄 **ExerciseTrackingService.js**   | Handles tracking user workout sessions and progress.                           |
| ┣ 📄 **MediaService.js**              | Manages media-related operations like uploads.                                 |
| ┣ 📄 **SplitExerciseService.js**      | Handles splitting exercises into segments.                                     |
| ┣ 📄 **UserService.js**               | Manages user-related API calls.                                                |
| ┣ 📄 **WorkoutService.js**            | Handles workout-related API calls.                                             |
| ┗ 📄 **WorkoutSplitsService.js**      | Manages splits in workout routines.                                            |
| 📁 **utils/**                         | Utility functions for common logic and helpers.                                |
| ┣ 📄 **authUtils.js**                 | Contains helper functions for authentication.                                  |
| ┣ 📄 **homePageUtils.js**             | Utility functions for the home page.                                           |
| ┣ 📄 **myWorkoutPlanUtils.js**        | Functions for managing workout plans.                                          |
| ┣ 📄 **profilePageUtils.js**          | Utility functions for the profile page.                                        |
| ┣ 📄 **realTimeUtils.js**             | Utilities for managing real-time data from Supabase.                           |
| ┣ 📄 **startWorkoutUtils.js**         | Functions for starting workouts.                                               |
| ┗ 📄 **statisticsUtils.js**           | Functions for managing statistics data.                                        |
| 📁 **src/**                           | Core configuration files for the app.                                          |
| ┗ 📄 **supabaseClient.js**            | Supabase client instance for API interactions.                                 |

---

## 🤝 Contributing

We welcome contributions from developers and fitness enthusiasts alike! Here’s how you can contribute:

1. **Fork the Repository**:
   Click the "Fork" button in the top-right corner of this page.

2. **Clone Your Fork**:

   ```bash
   git clone https://github.com/your-username/Strong-Together-App.git
   ```

3. **Create a New Branch**:

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Commit Your Changes**:

   ```bash
   git commit -m "Add YourFeatureName"
   ```

5. **Push to Your Branch**:

   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Open a Pull Request**:
   Go to the original repository and open a pull request from your fork.

<p align="center">
  <img src="assets/contributing_steps.png" alt="Contributing Steps" width="800" />
</p>

---

## 📸 Screenshots

### Home Screen

<p align="center">
  <img src="assets/screenshot_home.png" alt="Home Screen" width="400" />
</p>

### Workout Tracking

<p align="center">
  <img src="assets/screenshot_workout_tracking.png" alt="Workout Tracking" width="400" />
</p>

---

## 🌐 Contact

For any questions or support, feel free to reach out:

- **GitHub**: [@kobihanoch](https://github.com/kobihanoch)
- **Email**: [kobihanoch@example.com](mailto:kobikobi622@gmail.com)

---

⭐ If you like this project, don’t forget to give it a star! ⭐
