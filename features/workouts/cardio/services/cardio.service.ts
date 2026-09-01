import api from '../../../../infrastructure/api/api-config/api';
import { CreateAerobicEntryBody, GetAerobicHistoryQuery } from '@strong-together/shared';
import { GetAerobicHistoryResponse } from '@strong-together/shared';

export const getUserCardio = async (): Promise<GetAerobicHistoryResponse> => {
  const { data } = await api.get<GetAerobicHistoryResponse>('/api/aerobics', {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetAerobicHistoryQuery,
  });
  return data;
};

export const logUserCardio = async (payload: CreateAerobicEntryBody['record']): Promise<GetAerobicHistoryResponse> => {
  const { data } = await api.post<GetAerobicHistoryResponse>('/api/aerobics', {
    record: {
      ...payload,
    },
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  } satisfies CreateAerobicEntryBody);
  return data;
};
