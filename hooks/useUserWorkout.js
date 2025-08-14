import { useCallback, useState } from "react";
import { saveWorkoutData } from "../services/WorkoutService";

export const useUserWorkout = () => {
  const [saving, setSaving] = useState(false);

  const saveWorkoutProcess = useCallback(async (workoutData) => {
    setSaving(true);
    try {
      const data = await saveWorkoutData(workoutData);
      return data;
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
