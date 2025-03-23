import React, { useEffect, useState } from "react";
import { deleteWorkout } from "../services/WorkoutService";

export const useDeleteWorkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUserWorkout = async (userId) => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await deleteWorkout(userId);
      return data;
    } catch (err) {
      setError(err);
      console.log("Hook error occured: " + err);
    } finally {
      console.log("Hook: workout deleted successfully for user ID: " + userId);
      setLoading(false);
    }
  };
  return { deleteUserWorkout, loading, error };
};
