import { GetPersonalRecordsResponse, GetPersonalRecordsQuery } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';

// Gets user exercise tracking data - including home page ata PR most common etc...

export const getUserPrHistory = async (): Promise<GetPersonalRecordsResponse> => {
  const { data } = await api.get<GetPersonalRecordsResponse>(`/api/personal-records`, {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetPersonalRecordsQuery,
  });
  return data;
};
