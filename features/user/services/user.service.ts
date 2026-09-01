import { GetCurrentUserResponse, UpdateCurrentUserBody, UpdateCurrentUserResponse } from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';

export const fetchSelfUserData = async (): Promise<GetCurrentUserResponse> => {
  const { data } = await api.get<GetCurrentUserResponse>('/api/users/me');
  return data;
};

export const deleteSelfUser = async (): Promise<void> => {
  await api.delete('/api/users/me');
};

export const updateSelfUser = async (payload: UpdateCurrentUserBody): Promise<UpdateCurrentUserResponse> => {
  const { data } = await api.patch<UpdateCurrentUserResponse>('/api/users/me', payload);
  return data;
};
