import { UpdateCurrentUserResponse, UpdateCurrentUserBody } from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';

// Delete self user - procceed with CAUTION

export const deleteSelfUser = async (): Promise<void> => {
  await api.delete('/api/users/me');
};

export const updateSelfUser = async (payload: UpdateCurrentUserBody): Promise<UpdateCurrentUserResponse> => {
  const { data } = await api.patch<UpdateCurrentUserResponse>('/api/users/me', payload);
  return data;
};
