import { CreateWorkoutSessionBody } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';

// Saves a workout after working out - startworkout.js

export const saveWorkoutData = async (
  dataOfWorkout: CreateWorkoutSessionBody['workout'],
  startTime: number,
  endTime: number,
): Promise<void> => {
  const startTimeISO = new Date(startTime).toISOString();
  const endTimeISO = new Date(endTime).toISOString();

  await api.post('/api/workout-sessions', {
    workout: dataOfWorkout,
    workout_start_utc: startTimeISO,
    workout_end_utc: endTimeISO,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};
