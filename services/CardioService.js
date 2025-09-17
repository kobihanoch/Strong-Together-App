import api from "../api/api";

export const getUserCardio = async () => {
  const { data } = await api.get("/api/aerobics/get");
  return data;
};
