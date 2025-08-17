import api from "../api/api";

// Fetch self data
export const fetchSelfUserData = async () => {
  try {
    const response = await api.get("/api/users/get");
    return response;
  } catch (error) {
    throw error;
  }
};
