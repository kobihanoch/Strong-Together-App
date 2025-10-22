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

// Delete self user - procceed with CAUTION
export const deleteSelfUser = async () => {
  await api.delete("/api/users/deleteself");
};

export const updateSelfUser = async (payload) => {
  const { data } = await api.put("/api/users/updateself", payload);
  return data;
};
