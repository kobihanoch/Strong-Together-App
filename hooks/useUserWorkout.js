import { useEffect, useState } from "react";
import {
  getUserExerciseTracking,
  getUserWorkout,
  saveWorkoutData,
} from "../services/WorkoutService";
import { getMostFrequentSplitNameByUserId } from "../services/ExerciseTrackingService";

export const useUserWorkout = (userId) => {
  const [userWorkout, setUserWorkout] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState(null);
  const [workoutSplits, setWorkoutSplits] = useState(null);
  const [exercises, setExercises] = useState(null);
  const [exerciseTracking, setExerciseTracking] = useState(null);
  const [mostFrequentSplit, setMostFrequentSplit] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchUserWorkout = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      console.log("Trying to fetch data from hook...");
      const data = await getUserWorkout(userId);
      setUserWorkout(data);
    } catch (err) {
      setError(err);
      console.log("Failed. Error: " + err);
    } finally {
      //await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      console.log(
        "useUserWorkout: Data fetched from hook succesfully! State was updated."
      );
    }
  };

  const fetchUserExerciseTracking = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      console.log("Trying to fetch data from hook...");
      const data = await getUserExerciseTracking(userId);
      console.log(JSON.stringify(data));
      setExerciseTracking(data);
      const frequentSplit = await getMostFrequentSplitNameByUserId(userId);
      setMostFrequentSplit(frequentSplit);
    } catch (err) {
      setError(err);
      console.log("Failed. Error: " + err);
    } finally {
      //await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      console.log(
        "useUserWorkout: Data fetched from hook succesfully! State was updated."
      );
    }
  };

  useEffect(() => {
    if (userWorkout && userWorkout.length > 0 && userWorkout[0]) {
      const workoutObj = Object.fromEntries(
        Object.entries(userWorkout[0]).slice(0, 7)
      );
      setWorkout(workoutObj);

      const fullWorkoutSplits = userWorkout[0].workoutsplits || [];
      const splits = fullWorkoutSplits.map((split) =>
        Object.fromEntries(Object.entries(split).slice(0, 5))
      );
      setWorkoutSplits(splits);

      const allExercises = fullWorkoutSplits.flatMap((split) =>
        (split.exercisetoworkoutsplit ?? []).map((item) => {
          const { exercises, ...itemWithoutExercises } = item;
          return {
            ...itemWithoutExercises,
            ...exercises,
          };
        })
      );
      setExercises(allExercises);
    } else {
      setWorkout(null);
      setWorkoutSplits([]);
      setExercises([]);
    }
  }, [userWorkout]);

  useEffect(() => {
    fetchUserWorkout();
  }, [userId]);

  const saveWorkoutProccess = async (workoutData) => {
    setSaving(true);
    try {
      await saveWorkoutData(workoutData);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      console.log("Saving susccsfully workout of user!");
      setSaving(false);
    }
  };

  return {
    userWorkout,
    loading,
    error,
    refetch: fetchUserWorkout,
    fetchUserExerciseTracking,
    exerciseTracking,
    workout,
    workoutSplits,
    exercises,
    mostFrequentSplit,
    saveWorkoutProccess,
  };
};
