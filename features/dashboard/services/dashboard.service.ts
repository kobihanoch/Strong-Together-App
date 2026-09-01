import { GetWorkoutHistoryQuery, GetWorkoutStatisticsResponse } from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';

export const getUserDashboardStats = async (): Promise<GetWorkoutStatisticsResponse> => {
  const { data } = await api.get<GetWorkoutStatisticsResponse>(`/api/workout-statistics`, {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetWorkoutHistoryQuery,
  });
  return data;
};
