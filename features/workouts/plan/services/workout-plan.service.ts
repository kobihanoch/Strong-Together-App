import { GetWholeUserWorkoutPlanQuery } from '@strong-together/shared';
import api from '../../../../../infrastructure/api/api';
import { GetWholeUserWorkoutPlanResponse } from '@strong-together/shared';

// Fetch self workout plan
export const getUserWorkout = async (): Promise<GetWholeUserWorkoutPlanResponse> => {
  const { data } = await api.get<GetWholeUserWorkoutPlanResponse>('/api/workouts/getworkout', {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetWholeUserWorkoutPlanQuery,
  });
  return data;
};

