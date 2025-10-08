import api from "../api/api";

export const getUserCardio = async () => {
  const { data } = await api.get("/api/aerobics/get", {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
  });
  return data;
};

export const logUserCardio = async (durationMins, durationSec, type) => {
  const { data } = await api.post("/api/aerobics/add", {
    record: {
      durationMins,
      durationSec,
      type,
    },
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  return data;
};
