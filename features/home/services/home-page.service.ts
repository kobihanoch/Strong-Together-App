import { GetExerciseTrackingQuery, GetExerciseTrackingStatsResponse } from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';

// Gets user exercise tracking data - including home page ata PR most common etc...
export const getUserDashboardStats = async (): Promise<GetExerciseTrackingStatsResponse> => {
  const { data } = await api.get<GetExerciseTrackingStatsResponse>(`/api/workouts/gettrackingstats`, {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetExerciseTrackingQuery,
  });
  return data;
};
