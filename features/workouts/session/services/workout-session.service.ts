import { FinishUserWorkoutBody } from '@strong-together/shared';
import api from '../../../../../infrastructure/api/api';
import { FinishUserWorkoutResponse } from '@strong-together/shared';

// Saves a workout after working out - startworkout.js
export const saveWorkoutData = async (
  dataOfWorkout: FinishUserWorkoutBody['workout'],
  startTime: number,
  endTime: number,
): Promise<FinishUserWorkoutResponse> => {
  const startTimeISO = new Date(startTime).toISOString();
  const endTimeISO = new Date(endTime).toISOString();

  const { data } = await api.post<FinishUserWorkoutResponse>('/api/workouts/finishworkout', {
    workout: dataOfWorkout,
    workout_start_utc: startTimeISO,
    workout_end_utc: endTimeISO,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  return data;
};
