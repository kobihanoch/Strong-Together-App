import api from "../api/api";

const GlobalAuth = {
  setAccessToken: (t) => {
    api.defaults.headers.common.Authorization = `Bearer ${t}`;
  },
  logout: null,
};

export default GlobalAuth;
