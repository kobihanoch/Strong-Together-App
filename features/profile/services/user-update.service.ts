import { UpdateAuthenticatedUserResponse, UpdateUserBody } from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';

// Delete self user - procceed with CAUTION
export const deleteSelfUser = async (): Promise<void> => {
  await api.delete('/api/users/deleteself');
};

export const updateSelfUser = async (payload: UpdateUserBody): Promise<UpdateAuthenticatedUserResponse> => {
  const { data } = await api.put<UpdateAuthenticatedUserResponse>('/api/users/updateself', payload);
  return data;
};
