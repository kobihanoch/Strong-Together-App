import type {
  CreateUserBody,
  GetAuthenticatedUserByIdResponse,
  UserInsert,
} from '@strong-together/shared';

export type AppUser = GetAuthenticatedUserByIdResponse;
export type LoginCredentials = { identifier: string; password: string };
export type RegistrationInput = Required<Pick<UserInsert, 'username' | 'email'>> & {
  gender: CreateUserBody['gender'];
  fullName: UserInsert['name'];
  password: string;
};
