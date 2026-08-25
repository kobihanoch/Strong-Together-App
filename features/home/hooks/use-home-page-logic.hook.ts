import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo } from 'react';
import { RootParamList } from '../../../navigation/types/appStackTypes';
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { useMessages } from '../../messages/providers/MessagesProvider';
import { useCardioContext } from '../../workouts/shared/providers/CardioProvider';
import { useWorkoutHistoryContext } from '../../workouts/shared/providers/WorkoutHistoryProvider';
import { useWorkoutPlanContext } from '../../workouts/shared/providers/WorkoutPlanProvider';
import { HOME_DASHBOARD_MOCK, USE_MOCK_AEROBICS } from '../data/home-dashboard.mock';
import { HomeDashboardData } from '../types/use-home-page.types';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const useHomePageLogic = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme } = useAppTheme();
  const { user } = useAuth();
  const { unreadMessages } = useMessages();
  const { workout, workoutSplits, exercises } = useWorkoutPlanContext();
  const { exerciseTrackingMaps, analyzedExerciseTrackingData } = useWorkoutHistoryContext();
  const { weeklyCardioMap } = useCardioContext();

  const latestWorkout = useMemo(() => {
    const entries = Object.entries(exerciseTrackingMaps?.byDate ?? {}).sort(([a], [b]) => b.localeCompare(a));
    return entries[0] ?? null;
  }, [exerciseTrackingMaps]);

  const nextSplit = useMemo(() => {
    if (!workoutSplits.length) return null;
    const lastSplitName = latestWorkout?.[1]?.[0]?.splitName;
    const lastIndex = workoutSplits.findIndex((split) => split.name === lastSplitName);
    return workoutSplits[(lastIndex + 1) % workoutSplits.length];
  }, [latestWorkout, workoutSplits]);

  const data = useMemo<HomeDashboardData>(() => {
    const weekly = Object.entries(weeklyCardioMap ?? {}).sort(([a], [b]) => b.localeCompare(a))[0]?.[1];
    const aerobicMinutes = Array(7).fill(0) as number[];
    weekly?.records.forEach((record) => {
      aerobicMinutes[new Date(record.workoutTimeUtc).getDay()] += record.durationMins;
    });
    const orderedDays = [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => ({
      label: DAY_LABELS[dayIndex],
      minutes: aerobicMinutes[dayIndex],
    }));

    const latestEntries = latestWorkout?.[1] ?? [];
    const pr = analyzedExerciseTrackingData?.pr;
    const estimatedOneRepMaxKg = pr?.maxWeight
      ? Math.round(pr.maxWeight * (1 + pr.maxReps / 30) * 10) / 10
      : HOME_DASHBOARD_MOCK.estimatedOneRepMax.valueKg;
    const nextExercises = nextSplit ? (exercises[nextSplit.name] ?? []) : [];

    return {
      theme,
      state: {
        hasWorkout: !!workout && workoutSplits.length > 0,
        hasTracking: !!latestWorkout && (analyzedExerciseTrackingData?.workoutCount ?? 0) > 0,
      },
      user: {
        displayName: user?.name?.trim().split(' ')[0] || user?.username || 'Athlete',
        profilePicPath: user?.profilePicPath ?? null,
        gender: user?.gender ?? null,
        unreadCount: unreadMessages.length,
      },
      nextWorkout: nextSplit
        ? {
            name: nextSplit.name,
            exerciseCount: nextExercises.length,
            setCount: nextExercises.reduce((total, exercise) => total + exercise.sets.length, 0),
          }
        : HOME_DASHBOARD_MOCK.nextWorkout,
      gymActivity: HOME_DASHBOARD_MOCK.gymActivity,
      lastWorkout: latestWorkout
        ? {
            name: latestEntries[0]?.splitName ?? HOME_DASHBOARD_MOCK.lastWorkout.name,
            dateLabel: new Date(`${latestWorkout[0]}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            exerciseCount: latestEntries.length,
            setCount: latestEntries.reduce((total, exercise) => total + exercise.reps.length, 0),
          }
        : HOME_DASHBOARD_MOCK.lastWorkout,
      aerobics: !USE_MOCK_AEROBICS && weekly ? { totalMinutes: weekly.totalDurationMins, days: orderedDays } : HOME_DASHBOARD_MOCK.aerobics,
      achievement: {
        exercise: pr?.maxExercise ?? HOME_DASHBOARD_MOCK.achievement.exercise,
        value: pr?.maxWeight ? `${pr.maxWeight} kg PR` : HOME_DASHBOARD_MOCK.achievement.value,
        estimatedOneRepMaxKg,
      },
    };
  }, [
    analyzedExerciseTrackingData,
    exercises,
    latestWorkout,
    nextSplit,
    theme,
    unreadMessages.length,
    user,
    weeklyCardioMap,
    workout,
    workoutSplits.length,
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
  };
};

export default useHomePageLogic;
