import { CreateUserBody, LoginRequestBody } from '@strong-together/shared';
import { AppUser } from '../../types/auth.types';

export type UserCachePayload = AppUser | null;

export interface AuthProviderValue {
  authPhase: 'checking' | 'authed' | 'guest';
  isLoggedIn: boolean;
  user: AppUser | null;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null | undefined>>;
  userIdCache: AppUser['id'] | null;
  loading: boolean;
  userDataLoading: boolean;
  googleLoading: boolean;
  appleLoading: boolean;
  isWorkoutMode: boolean;
  setIsWorkoutMode: React.Dispatch<React.SetStateAction<boolean>>;
  isValidatedWithServer: boolean;
  register: (
    email: CreateUserBody['email'],
    password: CreateUserBody['password'],
    username: CreateUserBody['username'],
    fullName: CreateUserBody['fullName'],
    gender: CreateUserBody['gender'],
  ) => Promise<void>;
  login: (identifier: LoginRequestBody['identifier'], password: LoginRequestBody['password']) => Promise<void>;
  handleAppleAuth: () => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
  logout: () => Promise<void>;
  initial: {
    initializeUserSession: (username: AppUser['username']) => Promise<void>;
  };
}
