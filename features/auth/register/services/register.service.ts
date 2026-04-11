import api from '../../../../api/api';
import { CreateUserBody } from '@strong-together/shared';
import { CreateUserResponse } from '@strong-together/shared';

export const registerUser = async (
  email: CreateUserBody['email'],
  password: CreateUserBody['password'],
  username: CreateUserBody['username'],
  fullName: CreateUserBody['fullName'],
  gender: CreateUserBody['gender'],
): Promise<void> => {
  try {
    await api.post<CreateUserResponse>('/api/users/create', {
      username,
      fullName,
      email,
      password,
      gender,
    } satisfies CreateUserBody);
  } catch (error) {
    throw error;
  }
};
