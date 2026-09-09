import { GetWorkoutPlanQuery, ReplaceWorkoutPlanBody } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';
import { GetWorkoutPlanResponse } from '@strong-together/shared';
import { getTimeZoneFromStore } from '../../../../shared/stores/time-zone.store';

// Fetch self workout plan

export const getUserWorkout = async (): Promise<GetWorkoutPlanResponse> => {
  const { data } = await api.get<GetWorkoutPlanResponse>('/api/workout-plan', {
    params: { tz: getTimeZoneFromStore() } satisfies GetWorkoutPlanQuery,
  });
  return data;
};

export const addWorkout = async (workoutData: ReplaceWorkoutPlanBody['workoutData']): Promise<void> => {
  await api.put('/api/workout-plan', {
    workoutData,
    tz: getTimeZoneFromStore(),
  } satisfies ReplaceWorkoutPlanBody);
};
