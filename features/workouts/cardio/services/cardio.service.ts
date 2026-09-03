import api from '../../../../infrastructure/api/api-config/api';
import {
  CreateAerobicEntryBody,
  CreateAerobicEntryQuery,
  DeleteAerobicEntryQuery,
  DeleteAerobicEntryResponse,
  GetAerobicHistoryQuery,
  GetAerobicHistoryResponse,
  UpdateAerobicEntryBody,
  UpdateAerobicEntryQuery,
  UpdateAerobicEntryResponse,
} from '@strong-together/shared';
import { CardioEntryInput, EditableCardioRecord } from '../types/cardio.types';

export const getUserCardio = async (): Promise<GetAerobicHistoryResponse> => {
  const { data } = await api.get<GetAerobicHistoryResponse>('/api/aerobics', {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetAerobicHistoryQuery,
  });
  return data;
};

export const logUserCardio = async (payload: CreateAerobicEntryBody['record']): Promise<GetAerobicHistoryResponse> => {
  const params = { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies CreateAerobicEntryQuery;
  const body = { record: payload } satisfies CreateAerobicEntryBody;
  const { data } = await api.post<GetAerobicHistoryResponse>('/api/aerobics', body, { params });
  return data;
};

export const updateUserCardio = async (id: EditableCardioRecord['id'], record: CardioEntryInput): Promise<UpdateAerobicEntryResponse> => {
  const params = { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies UpdateAerobicEntryQuery;
  const body = { record } satisfies UpdateAerobicEntryBody;
  const { data } = await api.put<UpdateAerobicEntryResponse>(`/api/aerobics/${id}`, body, { params });
  return data;
};

export const deleteUserCardio = async (id: EditableCardioRecord['id']): Promise<DeleteAerobicEntryResponse> => {
  const params = { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies DeleteAerobicEntryQuery;
  const { data } = await api.delete<DeleteAerobicEntryResponse>(`/api/aerobics/${id}`, { params });
  return data;
};
