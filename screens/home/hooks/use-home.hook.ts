import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo } from 'react';
import useDashboard from '../../../features/dashboard/use-dashboard.hook';
import { RootParamList } from '../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import { getStartOfWeek } from '../../../shared/utils/shared-utils';
import { fillCardioGraph, getNextWorkoutSplit } from '../utils/home-page.utils';
import { useUser } from '../../../features/user/hooks/use-user.hook';
import { useMessages } from '../../../features/messages/hooks/use-messages.hook';
import { useWorkoutPlan } from '../../../features/workouts/plan/hooks/use-workout-plan.hook';
import { useCardio } from '../../../features/workouts/cardio/hooks/use-cardio.hook';
import { ExerciseInPlan, WorkoutSplit } from '../../../features/workouts/plan/types/workout-plan.types';

/**
 * Composes the Home screen view model from TanStack-backed feature data.
 *
 * It combines dashboard statistics, workout-plan and cardio queries with
 * messages, authenticated-user presentation data, and navigation actions.
 *
 * @returns The Home view model, navigation actions, and aggregate loading state.
 */
const useHome = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme } = useAppTheme();
  const { data: userData, loadingStates: userLoadingStates } = useUser();
  const { data: messagesData, loadingStates: messagesLoadingStates } = useMessages();
  const { data: workoutPlanData, loadingStates: workoutPlanLoadingStates } = useWorkoutPlan();
  const { data: cardioData, loadingStates: cardioLoadingStates, actions: cardioActions } = useCardio();
  const { data: dashboardData, loadingStates: dashboardLoadingStates } = useDashboard();

  const nextSplit: WorkoutSplit | undefined = getNextWorkoutSplit(workoutPlanData.workoutSplits, dashboardData?.nextWorkoutSplit ?? null);

  const data = useMemo(() => {
    const lastWorkout = dashboardData?.lastWorkoutStats;
    const latestPr = dashboardData?.latestPr?.[0];
    const estimatedOneRepMax = latestPr?.estimatedOneRepMax ? Number(latestPr.estimatedOneRepMax.toFixed(0)) : 0;
    const nextExercises: ExerciseInPlan[] = nextSplit?.exercises ?? [];

    return {
      theme,
      state: {
        hasWorkout: workoutPlanData.hasWorkoutPlan,
        hasTracking: dashboardData?.hasExerciseTracking ?? false,
      },
      user: {
        displayName: userData?.name?.trim().split(' ')[0] || userData?.username || 'Athlete',
        profilePicPath: userData?.profilePicPath ?? null,
        gender: userData?.gender ?? null,
        unreadCount: messagesData.unreadMessages.length,
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
      aerobics: {
        totalDurationMins: cardioData.cardioForSelectedWeek(getStartOfWeek())?.totalDurationMins ?? 0,
        totalDurationSecs: cardioData.cardioForSelectedWeek(getStartOfWeek())?.totalDurationSec ?? 0,
        days: fillCardioGraph(cardioData.weeklyCardioMap),
      },
      achievement: {
        exercise: latestPr?.exerciseName ?? '',
        value: latestPr ? `${latestPr.prWeight} kg PR` : '',
        estimatedOneRepMax,
      },
    };
  }, [
    dashboardData,
    nextSplit,
    theme,
    workoutPlanData.hasWorkoutPlan,
    userData?.name,
    userData?.username,
    userData?.profilePicPath,
    userData?.gender,
    messagesData.unreadMessages.length,
    cardioData,
  ]);

  return {
    data,
    actions: {
      openInbox: () => navigation.navigate('Inbox'),
      createWorkout: () => navigation.navigate('CreateWorkout'),
      startWorkout: () =>
        nextSplit ? navigation.navigate('StartWorkout', { workoutSplit: nextSplit }) : navigation.navigate('MyWorkoutPlan'),
      openProgress: () => navigation.navigate('TrackHistory'),
      openHistory: () => navigation.navigate('TrackHistory'),
      logCardio: cardioActions.logCardio,
    },
    loadingStates: {
      isPending:
        dashboardLoadingStates.isPending ||
        cardioLoadingStates.isPending ||
        messagesLoadingStates.isPending ||
        workoutPlanLoadingStates.isPending ||
        userLoadingStates.isPending,
      isCardioUpdating: cardioLoadingStates.isUpdating,
    },
  };
};

export default useHome;
