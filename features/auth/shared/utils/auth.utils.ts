import api from '../../../../../infrastructure/api/api';
import { bootstrapApi } from '../../../../../infrastructure/api/bootstrap-api';

const GlobalAuth: {
  setAccessToken: (t: string | null) => void;
  logout: (() => void) | null;
  setUsernameInHeader: (username: string | null) => void;
} = {
  setAccessToken: (t) => {
    api.defaults.headers.common.Authorization = `DPoP ${t}`;
    bootstrapApi.defaults.headers.common.Authorization = `DPoP ${t}`;
  },
  logout: null,
  setUsernameInHeader: (username) => {
    api.defaults.headers.common['x-username'] = username;
    bootstrapApi.defaults.headers.common['x-username'] = username;
  },
};

export default GlobalAuth;
