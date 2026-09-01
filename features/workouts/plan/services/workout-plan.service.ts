import { GetWorkoutPlanQuery } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';
import { GetWorkoutPlanResponse } from '@strong-together/shared';

// Fetch self workout plan

export const getUserWorkout = async (): Promise<GetWorkoutPlanResponse> => {
  const { data } = await api.get<GetWorkoutPlanResponse>('/api/workout-plan', {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetWorkoutPlanQuery,
  });
  return data;
};
