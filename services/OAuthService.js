import api from "../api/api";

export const loginOAuthWithAccessToken = async () => {
  const { data } = await api.post("api/oauth/proceedauth");
  return data;
};
