import { AddWorkoutBody } from '@strong-together/shared';
import api from '../../../../../infrastructure/api/api';
import { AddWorkoutResponse } from '@strong-together/shared';

// Add a new workout plan
export const addWorkout = async (workoutData: AddWorkoutBody['workoutData']): Promise<AddWorkoutResponse> => {
  const { data } = await api.post<AddWorkoutResponse>('/api/workouts/add', {
    workoutData,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  } satisfies AddWorkoutBody);
  return data;
};
