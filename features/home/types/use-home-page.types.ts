import { AppThemeColors } from '../../../shared/constants/theme';
import { AppUser } from '../../auth/shared/types/auth.types';
import { WorkoutSplit } from '../../workouts/shared/types/workout.types';

export type HomeDashboardData = {
  theme: AppThemeColors;
  state: { hasWorkout: boolean; hasTracking: boolean };
  user: { displayName: string; profilePicPath: string | null; gender: AppUser['gender'] | null; unreadCount: number };
  nextWorkout: Pick<WorkoutSplit, 'id' | 'name' | 'muscleGroup' | 'orderIndex'> & {
    exerciseCount: number;
    setCount: number;
  };
  gymActivity: { completedThisWeek: number; weeklyTarget: number; weekStreak: number };
  lastWorkout: { name: string; dateLabel: string; exerciseCount: number; setCount: number };
  aerobics: { totalMinutes: number; days: Array<{ label: string; minutes: number }> };
  achievement: { exercise: string; value: string; estimatedOneRepMax: number };
};
