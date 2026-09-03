import type { CreateUserBody, LoginRequestBody } from '@strong-together/shared';

export type LoginCredentials = LoginRequestBody;
export type RegistrationInput = CreateUserBody;
export type AuthPhase = 'checking' | 'authed' | 'guest';
