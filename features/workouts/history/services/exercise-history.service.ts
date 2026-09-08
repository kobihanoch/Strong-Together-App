import { GetExerciseHistoryResponse, GetExerciseHistoryQuery } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';
import { getTimeZoneFromStore } from '../../../../shared/stores/time-zone.store';

export const getUserExerciseHistory = async (): Promise<GetExerciseHistoryResponse> => {
  const { data } = await api.get<GetExerciseHistoryResponse>(`/api/exercise-history`, {
    params: { tz: getTimeZoneFromStore() } satisfies GetExerciseHistoryQuery,
  });
  return data;
};
