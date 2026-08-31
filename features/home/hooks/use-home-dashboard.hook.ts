import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { RootParamList } from '../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import { useUser } from '../../auth/shared/hooks/use-user.hook';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { useMessages } from '../../messages/providers/MessagesProvider';
import { useCardio } from '../../workouts/cardio/hooks/use-cardio.hook';
import { useWorkoutPlan } from '../../workouts/plan/hooks/use-workout-plan.hook';
import { ExerciseInPlan, WorkoutSplit } from '../../workouts/plan/types/workout-plan.types';
import { getUserDashboardStats } from '../services/home-page.service';
import { HomeDashboardStats } from '../types/use-home-page.types';
import { fillCardioGraph, getNextWorkoutSplit } from '../utils/home-page.utils';

/**
 * Composes the Home screen view model from TanStack-backed feature data.
 *
 * It combines dashboard statistics, workout-plan and cardio queries with
 * messages, authenticated-user presentation data, and navigation actions.
 *
 * @returns The Home view model, navigation actions, and aggregate loading state.
 */
const useHomeDashboard = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme } = useAppTheme();
  const { data: user, loadingStates: userLoadingStates } = useUser();
  const { unreadMessages, loadingStates: messagesLoadingStates } = useMessages();
  const { data: workoutPlanData, loadingStates: workoutPlanLoadingStates } = useWorkoutPlan();
  const { data: cardioData, loadingStates: cardioLoadingStates } = useCardio();

  const { isValidatedWithServer, userIdCache: userId } = useAuth();

  const query = useQuery({
    queryKey: ['home-dashboard', userId],
    queryFn: async (): Promise<HomeDashboardStats> => await getUserDashboardStats(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const dashboardData = query.data;

  const isLoading =
    query.isPending ||
    cardioLoadingStates.isPending ||
    messagesLoadingStates.isPending ||
    workoutPlanLoadingStates.isPending ||
    userLoadingStates.isPending;

  const isFetching =
    query.isFetching ||
    cardioLoadingStates.isFetching ||
    messagesLoadingStates.isFetching ||
    workoutPlanLoadingStates.isFetching ||
    userLoadingStates.isFetching;

  const nextSplit: WorkoutSplit | undefined = getNextWorkoutSplit(workoutPlanData.workoutSplits, dashboardData?.nextWorkoutSplit ?? null);

  const data = useMemo(() => {
    const lastWorkout = dashboardData?.lastWorkoutStats;
    const pr = dashboardData?.prs[0];
    const estimatedOneRepMax = pr?.estimatedOneRepMax ?? 0;
    const nextExercises: ExerciseInPlan[] = nextSplit?.exercises ?? [];

    return {
      theme,
      state: {
        hasWorkout: workoutPlanData.hasWorkoutPlan,
        hasTracking: dashboardData?.hasExerciseTracking ?? false,
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
      gymActivity: dashboardData
        ? {
            completedThisWeek: dashboardData.workoutTargets.workoutCountThisWeek,
            weeklyTarget: dashboardData.workoutTargets.workoutCountScheduledPerWeek,
            weekStreak: dashboardData.workoutTargets.weekStreak,
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
      aerobics: { totalMinutes: cardioData.weeklyCardioMap?.totalDurationMins ?? 0, days: fillCardioGraph(cardioData.weeklyCardioMap) },
      achievement: {
        exercise: pr?.exerciseName ?? '',
        value: pr ? `${pr.prWeight} kg PR` : '',
        estimatedOneRepMax,
      },
    };
  }, [
    cardioData,
    dashboardData,
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
    loadingStates: { isLoading, isFetching },
  };
};

export default useHomeDashboard;
