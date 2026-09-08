import api from '../../../../infrastructure/api/api-config/api';
import {
  CreateAerobicEntryBody,
  CreateAerobicEntryQuery,
  DeleteAerobicEntryQuery,
  GetAerobicHistoryQuery,
  GetAerobicHistoryResponse,
  UpdateAerobicEntryBody,
  UpdateAerobicEntryQuery,
} from '@strong-together/shared';
import { CardioEntryInput, EditableCardioRecord } from '../types/cardio.types';
import { getTimeZoneFromStore } from '../../../../shared/stores/time-zone.store';

export const getUserCardio = async (): Promise<GetAerobicHistoryResponse> => {
  const { data } = await api.get<GetAerobicHistoryResponse>('/api/aerobics', {
    params: { tz: getTimeZoneFromStore() } satisfies GetAerobicHistoryQuery,
  });
  return data;
};

export const logUserCardio = async (payload: CreateAerobicEntryBody['record']): Promise<void> => {
  const params = { tz: getTimeZoneFromStore() } satisfies CreateAerobicEntryQuery;
  const body = { record: payload } satisfies CreateAerobicEntryBody;
  await api.post('/api/aerobics', body, { params });
};

export const updateUserCardio = async (id: EditableCardioRecord['id'], record: CardioEntryInput): Promise<void> => {
  const params = { tz: getTimeZoneFromStore() } satisfies UpdateAerobicEntryQuery;
  const body = { record } satisfies UpdateAerobicEntryBody;
  await api.put(`/api/aerobics/${id}`, body, { params });
};

export const deleteUserCardio = async (id: EditableCardioRecord['id']): Promise<void> => {
  const params = { tz: getTimeZoneFromStore() } satisfies DeleteAerobicEntryQuery;
  await api.delete(`/api/aerobics/${id}`, { params });
};
