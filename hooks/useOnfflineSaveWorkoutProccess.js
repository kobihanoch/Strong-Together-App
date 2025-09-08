import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { cacheSetJSON, keyStartWorkout, TTL_36H } from "../cache/cacheUtils";

const useOfflineSaveWorkoutProcess = ({ workoutProccess }) => {
  const { user } = useAuth();
  [startWorkoutCacheKey, setStartWorkoutCacheKey] = useState(null);

  // Build cache key auto (only when user is available)
  useEffect(() => {
    if (user) setStartWorkoutCacheKey(keyStartWorkout(user?.id));
  }, [user]);

  // Triggers cache writing in workout proccess change
  useEffect(() => {
    if (startWorkoutCacheKey)
      cacheSetJSON(startWorkoutCacheKey, workoutProccess, TTL_36H);
  }, [workoutProccess, startWorkoutCacheKey]);

  return { data };
};

export default useOfflineSaveWorkoutProcess;
