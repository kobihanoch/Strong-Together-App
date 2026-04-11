import { useMemo } from 'react';
import { useWorkoutHistoryContext } from '../../workouts/shared/providers/WorkoutHistoryProvider';
import { useAuth } from '../../../context/AuthContext';
import { useGlobalAppLoadingContext } from '../../../context/GlobalAppLoadingContext';
import { useWorkoutPlanContext } from '../../workouts/shared/providers/WorkoutPlanProvider';
import { HomePageData } from '../types/use-home-page.types';

const useHomePageLogic = (): { data: HomePageData } => {
  // Auth state (user + global session loading)
  const { user } = useAuth();
  const { isLoading } = useGlobalAppLoadingContext();

  // Workout state (plan + derived maps + loading)
  const {
    workout,
    workoutSplits, // [A,B,C...]
  } = useWorkoutPlanContext();

  // Analysis state (tracking + derived analytics + loading)
  const { analyzedExerciseTrackingData } = useWorkoutHistoryContext();
  const hasTracking = useMemo(() => !!analyzedExerciseTrackingData, [analyzedExerciseTrackingData]);

  // Derive stable user fields
  const {
    username = '',
    userId = '',
    firstName = '',
    profileImageUrl = '',
  } = useMemo(() => {
    const u = user;
    return {
      username: u?.username ?? '',
      userId: u?.id ?? '',
      firstName: u?.name!.trim().split(' ')[0],
      profileImageUrl: u?.profile_image_url ?? '',
    };
  }, [user]);

  // Derived workout flags/counters
  const { hasAssignedWorkout, workoutSplitsNumber } = useMemo(() => {
    const hasWorkout = !!workout;
    // workoutSplits is a map in the new context; count keys safely
    const splitsCount = workoutSplits ? Object.keys(workoutSplits).length : 0;
    return { hasAssignedWorkout: hasWorkout, workoutSplitsNumber: splitsCount };
  }, [workout, workoutSplits]);

  // Derived analysis fields
  const { PR, totalWorkoutNumber, mostFrequentSplit, lastWorkoutDate } = useMemo(() => {
    const a = analyzedExerciseTrackingData;
    return {
      PR: a?.pr ?? null,
      totalWorkoutNumber: a?.workoutCount ?? 0,
      mostFrequentSplit: a?.mostFrequentSplit ?? null,
      lastWorkoutDate: a?.lastWorkoutDate ?? 'none',
    };
  }, [analyzedExerciseTrackingData]);

  // Stable data object for easy consumption in components
  const data = useMemo<HomePageData>(
    () => ({
      username,
      userId,
      hasAssignedWorkout,
      hasTracking,
      profileImageUrl,
      firstName,
      lastWorkoutDate,
      totalWorkoutNumber,
      workoutSplitsNumber,
      mostFrequentSplit,
      PR,
      isLoading,
    }),
    [
      username,
      userId,
      hasAssignedWorkout,
      profileImageUrl,
      firstName,
      lastWorkoutDate,
      totalWorkoutNumber,
      workoutSplitsNumber,
      mostFrequentSplit,
      PR,
      isLoading,
    ],
  );

  return {
    data,
  };
};

export default useHomePageLogic;
