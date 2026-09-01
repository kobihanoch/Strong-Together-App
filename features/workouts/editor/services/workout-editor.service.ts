import { ReplaceWorkoutPlanBody } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';
import { ReplaceWorkoutPlanResponse } from '@strong-together/shared';

// Add a new workout plan

export const addWorkout = async (workoutData: ReplaceWorkoutPlanBody['workoutData']): Promise<ReplaceWorkoutPlanResponse> => {
  const { data } = await api.put<ReplaceWorkoutPlanResponse>('/api/workout-plan', {
    workoutData,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  } satisfies ReplaceWorkoutPlanBody);
  return data;
};
