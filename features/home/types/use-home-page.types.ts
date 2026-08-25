import { WorkoutHistoryAnalyzedExerciseTrackingData } from '../../workouts/history/types/workout-history.types';
import { AppUser } from '../../auth/shared/types/auth.types';
import { AppThemeColors } from '../../../shared/constants/theme';

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

export type HomeDashboardData = {
  theme: AppThemeColors;
  state: { hasWorkout: boolean; hasTracking: boolean };
  user: { displayName: string; profilePicPath: string | null; gender: AppUser['gender'] | null; unreadCount: number };
  nextWorkout: { name: string; exerciseCount: number; setCount: number };
  gymActivity: { completedThisWeek: number; weeklyTarget: number; weekStreak: number };
  lastWorkout: { name: string; dateLabel: string; exerciseCount: number; setCount: number };
  aerobics: { totalMinutes: number; days: Array<{ label: string; minutes: number }> };
  achievement: { exercise: string; value: string; estimatedOneRepMaxKg: number };
};
