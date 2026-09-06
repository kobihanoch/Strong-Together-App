import { GetWorkoutSchedulesResponse, ReplaceWorkoutSchedulesBody } from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';

export const getUserWorkoutSchedule = async (): Promise<GetWorkoutSchedulesResponse> => {
  const { data } = await api.get<GetWorkoutSchedulesResponse>(`/api/workout-schedules`);
  return data;
};

export const replaceUserWorkotuSchedules = async (workoutSchedules: ReplaceWorkoutSchedulesBody['schedules']): Promise<void> => {
  await api.put('/api/workout-schedules', {
    schedules: workoutSchedules,
  } satisfies ReplaceWorkoutSchedulesBody);
};
