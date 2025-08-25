import api from "../api/api";

export const getTrackingAnalytics = async () => {
  try {
    const { data } = await api.get("/api/analytics/get");
    return data;
  } catch (error) {
    throw error;
  }
};
