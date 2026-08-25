import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo } from 'react';
import { RootParamList } from '../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import { useGlobalAppLoadingContext } from '../../../shared/providers/GlobalAppLoadingProvider';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { useMessages } from '../../messages/providers/MessagesProvider';
import { useCardioContext } from '../../workouts/shared/providers/CardioProvider';
import { useWorkoutPlanContext } from '../../workouts/shared/providers/WorkoutPlanProvider';
import { ExerciseInPlan, WorkoutSplitFullData } from '../../workouts/shared/types/workout.types';
import { HomeDashboardData } from '../types/use-home-page.types';
import useHomePageCacheHandler from './use-home-page-cache-handler.hook';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const useHomePageLogic = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme } = useAppTheme();
  const { user, isValidatedWithServer } = useAuth();
  const { unreadMessages } = useMessages();
  const { workout, workoutSplits } = useWorkoutPlanContext();
  const { weeklyCardioMap } = useCardioContext();

  // Data for home page goes through cache pipeline
  const { dashboardStats = undefined, loading: dashboardLoading = true } = useHomePageCacheHandler({ user, isValidatedWithServer });

  // Global loading of app
  const { isLoading: appLoading = true } = useGlobalAppLoadingContext();
  const isLoading = appLoading || dashboardLoading || dashboardStats === undefined;
  const nextSplit: WorkoutSplitFullData | undefined | null = workoutSplits.filter(
    (split) => split.id === dashboardStats?.nextWorkoutSplit?.id,
  )[0];

  const data = useMemo<HomeDashboardData>(() => {
    // ssign to aerobics graph
    const weekly = Object.entries(weeklyCardioMap ?? {}).sort(([a], [b]) => b.localeCompare(a))[0]?.[1];
    const aerobicMinutes = Array(7).fill(0) as number[];
    weekly?.records.forEach((record) => {
      aerobicMinutes[new Date(record.workoutTimeUtc).getDay()] += record.durationMins;
    });
    const orderedDays = [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => ({
      label: DAY_LABELS[dayIndex],
      minutes: aerobicMinutes[dayIndex],
    }));

    const lastWorkout = dashboardStats?.lastWorkoutStats;
    const pr = dashboardStats?.prs[0];
    const estimatedOneRepMax = pr?.estimatedOneRepMax ?? 0;
    const nextExercises: ExerciseInPlan[] = nextSplit ? workoutSplits.filter((split) => split.id === nextSplit.id)[0].exercises : [];

    return {
      theme,
      state: {
        hasWorkout: !!workout && workoutSplits.length > 0,
        hasTracking: dashboardStats?.hasExerciseTracking ?? false,
      },
      user: {
        displayName: user?.name?.trim().split(' ')[0] || user?.username || 'Athlete',
        profilePicPath: user?.profilePicPath ?? null,
        gender: user?.gender ?? null,
        unreadCount: unreadMessages.length,
      },
      nextWorkout: nextSplit
        ? {
            id: nextSplit.id,
            name: nextSplit.name,
            orderIndex: nextSplit.orderIndex,
            muscleGroup: nextSplit.muscleGroup ?? '',
            exerciseCount: nextExercises.length,
            setCount: nextExercises ? nextExercises.reduce((total, exercise) => total + exercise.sets.length, 0) : 0,
          }
        : { id: 0, orderIndex: 0, muscleGroup: '', name: '', exerciseCount: 0, setCount: 0 },
      gymActivity: dashboardStats
        ? {
            completedThisWeek: dashboardStats.workoutTargets.workoutCountThisWeek,
            weeklyTarget: dashboardStats.workoutTargets.workoutCountScheduledPerWeek,
            weekStreak: dashboardStats.workoutTargets.weekStreak,
          }
        : { completedThisWeek: 0, weeklyTarget: 0, weekStreak: 0 },
      lastWorkout: lastWorkout?.workoutDate
        ? {
            name: lastWorkout.workoutSplitName ?? '',
            dateLabel: new Date(`${lastWorkout.workoutDate}T00:00:00`).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            exerciseCount: lastWorkout.exerciseTrackedCount ?? 0,
            setCount: lastWorkout.setTrackedCount ?? 0,
          }
        : { name: '', dateLabel: '', exerciseCount: 0, setCount: 0 },
      aerobics: { totalMinutes: weekly?.totalDurationMins ?? 0, days: orderedDays },
      achievement: {
        exercise: pr?.exerciseName ?? '',
        value: pr ? `${pr.prWeight} kg PR` : '',
        estimatedOneRepMax,
      },
    };
  }, [
    dashboardStats,
    nextSplit,
    theme,
    unreadMessages.length,
    user?.gender,
    user?.name,
    user?.profilePicPath,
    user?.username,
    weeklyCardioMap,
    workout,
    workoutSplits,
  ]);

  return {
    data,
    actions: {
      openInbox: () => navigation.navigate('Inbox'),
      createWorkout: () => navigation.navigate('CreateWorkout'),
      startWorkout: () =>
        nextSplit ? navigation.navigate('StartWorkout', { workoutSplit: nextSplit }) : navigation.navigate('MyWorkoutPlan'),
      openProgress: () => navigation.navigate('Analytics'),
      openHistory: () => navigation.navigate('Statistics'),
    },
    isLoading,
  };
};

export default useHomePageLogic;
