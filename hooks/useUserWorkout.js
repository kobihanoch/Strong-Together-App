import { useCallback, useState } from "react";
import { saveWorkoutData } from "../services/WorkoutService";
import { unpackFromExerciseTrackingData } from "../utils/authUtils";

export const useUserWorkout = () => {
  const [saving, setSaving] = useState(false);

  const saveWorkoutProcess = useCallback(async (workoutData) => {
    setSaving(true);
    try {
      const data = await saveWorkoutData(workoutData);
      return {
        exerciseTracking: data.exercisetracking,
        analysis: unpackFromExerciseTrackingData(data),
      };
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    saveWorkoutProcess,
    saving,
  };
};
