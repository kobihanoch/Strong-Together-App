import { useState } from "react";
import { saveWorkoutData } from "../services/WorkoutService";

export const useUserWorkout = (userId) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const saveWorkoutProccess = async (workoutData) => {
    setSaving(true);
    try {
      const data = await saveWorkoutData(workoutData);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      console.log("Saving susccsfully workout of user!");
      setSaving(false);
    }
  };

  return {
    saveWorkoutProccess,
  };
};
