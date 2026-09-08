import api from '../../../infrastructure/api/api-config/api';
import { AppUser } from '../../user/types/user.types';

export const setAccessToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `DPoP ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const setUsernameInHeader = (username: AppUser['username'] | null) => {
  api.defaults.headers.common['x-username'] = username;
};
