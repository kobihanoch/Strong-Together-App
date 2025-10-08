import api from "../api/api";
import { bootstrapApi } from "../api/bootstrapApi";

const GlobalAuth = {
  setAccessToken: (t) => {
    api.defaults.headers.common.Authorization = `Bearer ${t}`;
    bootstrapApi.defaults.headers.common.Authorization = `Bearer ${t}`;
  },
  logout: null,
  setUsernameInHeader: (username) => {
    api.defaults.headers.common["x-username"] = username;
    bootstrapApi.defaults.headers.common["x-username"] = username;
  },
};

export default GlobalAuth;
