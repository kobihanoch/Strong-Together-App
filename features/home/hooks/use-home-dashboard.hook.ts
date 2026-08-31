import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo } from 'react';
import { RootParamList } from '../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { useMessages } from '../../messages/providers/MessagesProvider';
import { useCardio } from '../../workouts/cardio/hooks/use-cardio.hook';
import { useWorkoutPlan } from '../../workouts/plan/hooks/use-workout-plan.hook';
import { HomeDashboardData } from '../types/use-home-page.types';
import useHomeDashboardCacheHandler from './use-home-dashboard-cache-handler.hook';
import { getNextWorkoutSplit } from '../utils/home-page.utils';
import { ExerciseInPlan, WorkoutSplit } from '../../workouts/plan/types/workout-plan.types';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const useHomeDashboard = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme } = useAppTheme();
  const { user, isValidatedWithServer } = useAuth();
  const { unreadMessages, fetchLoading: messagesFetchLoading } = useMessages();
  const { data: workoutPlanData, loadingStates: workoutPlanLoadingStates } = useWorkoutPlan();
  const { data: cardioData, loadingStates: cardioLoadingStates } = useCardio();

  // Home dashboard data goes through the cache pipeline.
  const { dashboardStats = undefined, loading: dashboardLoading = true } = useHomeDashboardCacheHandler({
    user,
    isValidatedWithServer,
  });

  const isLoading =
    dashboardLoading ||
    dashboardStats === undefined ||
    cardioLoadingStates.isLoading ||
    messagesFetchLoading ||
    workoutPlanLoadingStates.isLoading;

  const nextSplit: WorkoutSplit | undefined = getNextWorkoutSplit(workoutPlanData.workoutSplits, dashboardStats?.nextWorkoutSplit ?? null);

  const data = useMemo<HomeDashboardData>(() => {
    // Assign to aerobics graph
    const { weeklyCardioMap } = cardioData;
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
    const nextExercises: ExerciseInPlan[] = nextSplit?.exercises ?? [];

    return {
      theme,
      state: {
        hasWorkout: workoutPlanData.hasWorkoutPlan,
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
    cardioData,
    dashboardStats,
    nextSplit,
    theme,
    workoutPlanData.hasWorkoutPlan,
    user?.name,
    user?.username,
    user?.profilePicPath,
    user?.gender,
    unreadMessages.length,
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

export default useHomeDashboard;
