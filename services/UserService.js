import api from "../api/api";

// Fetch self data
export const fetchSelfUserData = async () => {
  try {
    const { data } = await api.get("/api/users/get");
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteSelfUser = async () => {
  await api("/api/users/deleteself");
};
