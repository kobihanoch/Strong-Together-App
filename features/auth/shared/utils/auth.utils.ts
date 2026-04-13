import api from '../../../../infrastructure/api/api-config/api';

const GlobalAuth: {
  setAccessToken: (t: string | null) => void;
  logout: (() => void) | null;
  setUsernameInHeader: (username: string | null) => void;
} = {
  setAccessToken: (t) => {
    api.defaults.headers.common.Authorization = `DPoP ${t}`;
  },
  logout: null,
  setUsernameInHeader: (username) => {
    api.defaults.headers.common['x-username'] = username;
  },
};

export default GlobalAuth;
