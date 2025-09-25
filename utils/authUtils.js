import api from "../api/api";
import { bootstrapApi } from "../api/bootstrapApi";

const GlobalAuth = {
  setAccessToken: (t) => {
    api.defaults.headers.common.Authorization = `Bearer ${t}`;
    bootstrapApi.defaults.headers.common.Authorization = `Bearer ${t}`;
  },
  logout: null,
};

export default GlobalAuth;
