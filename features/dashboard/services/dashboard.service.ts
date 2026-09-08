import { GetWorkoutHistoryQuery, GetWorkoutStatisticsResponse } from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';
import { getTimeZoneFromStore } from '../../../shared/stores/time-zone.store';

export const getUserDashboardStats = async (): Promise<GetWorkoutStatisticsResponse> => {
  const { data } = await api.get<GetWorkoutStatisticsResponse>(`/api/workout-statistics`, {
    params: { tz: getTimeZoneFromStore() } satisfies GetWorkoutHistoryQuery,
  });
  return data;
};
