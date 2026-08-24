import { WorkoutHistoryAnalyzedExerciseTrackingData } from '../../workouts/history/types/workout-history.types';
import { AppUser } from '../../auth/shared/types/auth.types';

export type HomePageData = {
  username: AppUser['username'];
  userId: AppUser['id'];
  hasAssignedWorkout: boolean;
  hasTracking: boolean;
  profilePicPath: AppUser['profilePicPath'];
  firstName: AppUser['name'];
  lastWorkoutDate: WorkoutHistoryAnalyzedExerciseTrackingData['lastWorkoutDate'];
  totalWorkoutNumber: WorkoutHistoryAnalyzedExerciseTrackingData['workoutCount'];
  workoutSplitsNumber: number;
  mostFrequentSplit: WorkoutHistoryAnalyzedExerciseTrackingData['mostFrequentSplit'] | null;
  PR: WorkoutHistoryAnalyzedExerciseTrackingData['pr'] | null;
  isLoading: boolean;
};
