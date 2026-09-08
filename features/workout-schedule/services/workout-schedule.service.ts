import {
  GetWorkoutSchedulesResponse,
  ReplaceWorkoutSchedulesBody,
  ReplaceWorkoutSchedulesResponse,
} from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';

export const getUserWorkoutSchedule = async (): Promise<GetWorkoutSchedulesResponse> => {
  const { data } = await api.get<GetWorkoutSchedulesResponse>(`/api/workout-schedules`);
  return data;
};

export const replaceUserWorkoutSchedules = async (
  workoutSchedules: ReplaceWorkoutSchedulesBody['schedules'],
): Promise<ReplaceWorkoutSchedulesResponse> => {
  const schedules = workoutSchedules.map((schedule) => ({
    ...schedule,
    startTime: schedule.startTime.slice(0, 5),
  }));

  const { data } = await api.put<ReplaceWorkoutSchedulesResponse>('/api/workout-schedules', {
    schedules,
  } satisfies ReplaceWorkoutSchedulesBody);

  return data;
};
