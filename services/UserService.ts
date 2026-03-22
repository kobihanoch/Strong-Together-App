import api from '../api/api';
import { UpdateUserBody } from '../types/api/user/requests';
import { UpdateAuthenticatedUserResponse, UserDataResponse } from '../types/api/user/responses';

// Fetch self data
export const fetchSelfUserData = async (): Promise<UserDataResponse> => {
  const { data } = await api.get<UserDataResponse>('/api/users/get');
  return data;
};

// Delete self user - procceed with CAUTION
export const deleteSelfUser = async (): Promise<void> => {
  await api.delete('/api/users/deleteself');
};

export const updateSelfUser = async (payload: UpdateUserBody): Promise<UpdateAuthenticatedUserResponse> => {
  const { data } = await api.put<UpdateAuthenticatedUserResponse>('/api/users/updateself', payload);
  return data;
};
