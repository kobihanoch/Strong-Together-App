import api from '../../../infrastructure/api/api-config/api';

const GlobalAuth: {
  setAccessToken: (t: string | null) => void;
  logout: (() => Promise<void>) | null;
  setUsernameInHeader: (username: string | null) => void;
} = {
  setAccessToken: (token) => {
    if (token) {
      api.defaults.headers.common.Authorization = `DPoP ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  },
  logout: null,
  setUsernameInHeader: (username) => {
    api.defaults.headers.common['x-username'] = username;
  },
};

export default GlobalAuth;
