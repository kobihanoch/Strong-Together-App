import { useState, useEffect } from "react";
import {
  fetchWorkoutsByUserId,
  addWorkout,
  deleteWorkout,
  updateWorkout,
} from "../services/WorkoutService";

export const useWorkouts = (userId) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all workouts for a user
  const getWorkoutByUserId = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWorkoutsByUserId(userId);
      setWorkouts(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getWorkoutByUserId();
    }
  }, [userId]);

  // Add a new workout plan
  const addNewWorkout = async (userId, name, splitsNumber) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const newWorkout = await addWorkout(userId, name, splitsNumber);
      setWorkouts((prev) => [...prev, newWorkout]); // Update state with the new workout
      return newWorkout;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const workout = workouts.length > 0 ? workouts[0] : null;

  return {
    workout,
    workouts,
    loading,
    error,
    getWorkoutByUserId,
    addNewWorkout,
  };
};

export default useWorkouts;
