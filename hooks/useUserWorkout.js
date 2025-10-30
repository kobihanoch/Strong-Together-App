import { useCallback, useState } from "react";
import { saveWorkoutData } from "../services/WorkoutService";

export const useUserWorkout = () => {
  const [saving, setSaving] = useState(false);

  const saveWorkoutProcess = useCallback(
    async (workoutData, startTime, endTime) => {
      setSaving(true);
      try {
        const data = await saveWorkoutData(workoutData, startTime, endTime);
        return {
          exerciseTrackingMaps: data.exerciseTrackingMaps,
          exerciseTrackingAnalysis: data.exerciseTrackingAnalysis,
        };
      } catch (err) {
        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return {
    saveWorkoutProcess,
    saving,
  };
};
