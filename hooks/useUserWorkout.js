import { useEffect, useState } from "react";
import {
  getUserExerciseTracking,
  getUserWorkout,
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
    if (userWorkout) {
      // Sets workout only from userWorkout
      const workoutObj = Object.fromEntries(
        Object.entries(userWorkout[0]).slice(0, 7)
      );
      setWorkout(workoutObj);

      // Sets workout splits only from userWorkout
      const fullWorkoutSplits = userWorkout[0].workoutsplits;
      const splits = [];
      fullWorkoutSplits.forEach((split) => {
        splits.push(Object.fromEntries(Object.entries(split).slice(0, 5)));
      });
      setWorkoutSplits(splits);

      // Sets exercises only from userWorkout
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
    }
  }, [userWorkout]);

  useEffect(() => {
    fetchUserWorkout();
  }, [userId]);

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
  };
};
