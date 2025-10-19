import api from "../api/api";
import { bootstrapApi } from "../api/bootstrapApi";

const GlobalAuth = {
  setAccessToken: (t) => {
    api.defaults.headers.common.Authorization = `DPoP ${t}`;
    bootstrapApi.defaults.headers.common.Authorization = `DPoP ${t}`;
  },
  logout: null,
  setUsernameInHeader: (username) => {
    api.defaults.headers.common["x-username"] = username;
    bootstrapApi.defaults.headers.common["x-username"] = username;
  },
};

export default GlobalAuth;
