import { GetWorkoutHistoryQuery } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';
import { GetWorkoutHistoryResponse } from '@strong-together/shared';

// Gets user exercise tracking data - including home page ata PR most common etc...

export const getUserExerciseTracking = async (): Promise<GetWorkoutHistoryResponse> => {
  const { data } = await api.get<GetWorkoutHistoryResponse>(`/api/workout-history`, {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetWorkoutHistoryQuery,
  });
  return data;
};
