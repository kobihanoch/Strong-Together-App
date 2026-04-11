import { GetExerciseTrackingQuery } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api';
import { GetExerciseTrackingResponse } from '@strong-together/shared';

// Gets user exercise tracking data - including home page ata PR most common etc...
export const getUserExerciseTracking = async (): Promise<GetExerciseTrackingResponse> => {
  const { data } = await api.get<GetExerciseTrackingResponse>(`/api/workouts/gettracking`, {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetExerciseTrackingQuery,
  });
  return data;
};
