import type { GetWholeUserWorkoutPlanResponse } from '@strong-together/shared';
import { useCallback, useMemo, useState } from 'react';
import { keyWorkoutPlan } from '../../../../../infrastructure/cache/cache-keys.utils';
import useCacheAndFetch from '../../../../../shared/hooks/use-cache-and-fetch.hook';
import { AppUser } from '../../../../auth/shared/types/auth.types';
import { getUserWorkout } from '../../../plan/services/workout-plan.service';
import { WorkoutPlan } from '../../../plan/types/workout-plan.types';

type UseWorkoutPlanCacheHandlerProps = {
  user: AppUser | null;
  isValidatedWithServer: boolean;
};

const useWorkoutPlanCacheHandler = ({ user, isValidatedWithServer }: UseWorkoutPlanCacheHandlerProps) => {
  // Raw workout plan from API
  const [workout, setWorkout] = useState<WorkoutPlan | undefined | null>(undefined);

  // Fetch function
  const fetchFn = useCallback(async () => await getUserWorkout(), []);

  // On data function
  const onDataFn = useCallback((data: GetWholeUserWorkoutPlanResponse): void => {
    setWorkout(data.workoutPlan); // Null if doesnt exist
  }, []);

  // Cache payload
  const cachePayload = useMemo(() => (workout === undefined ? undefined : { workoutPlan: workout }), [workout]);

  // Hook usage
  const { loading } = useCacheAndFetch<GetWholeUserWorkoutPlanResponse>(
    user, // user prop
    keyWorkoutPlan, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    'Workout Context', // log
  );

  return { workout, setWorkout, loading };
};

export default useWorkoutPlanCacheHandler;
