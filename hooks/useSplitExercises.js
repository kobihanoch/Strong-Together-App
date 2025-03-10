import { useState } from "react";
import {
  addExerciseToSplit,
  getExercisesBySplitId,
  getExercisesByWorkoutId,
  addExercisesToSplit,
} from "../services/SplitExerciseService";

const useSplitExercises = (workoutId) => {
  const [splitExercises, setSplitExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch exercises by split ID
  const fetchExercisesBySplitId = async (splitId) => {
    try {
      setLoading(true);
      const exercises = await getExercisesBySplitId(splitId);
      setSplitExercises(exercises);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all exercises by workout ID
  const fetchAllExercises = async (workoutId) => {
    setLoading(true);
    try {
      const exercises = await getExercisesByWorkoutId(workoutId);
      setAllExercises(exercises);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add multiple exercises to a specific split
  const addExercisesToWorkoutSplit = async (splitId, exercises) => {
    try {
      setLoading(true);

      if (!Array.isArray(exercises)) {
        return;
      }

      if (!exercises[Symbol.iterator]) {
        throw new Error("Exercises array is not iterable.");
      }

      if (exercises.length === 0) {
        return;
      }

      const fixedExercises = exercises.map((ex) => ({ ...ex }));
      const newExercises = await addExercisesToSplit(splitId, fixedExercises);

      setSplitExercises((prevExercises) => [...prevExercises, ...newExercises]);

      return newExercises;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    splitExercises,
    allExercises,
    loading,
    error,
    fetchExercisesBySplitId,
    addExercisesToWorkoutSplit,
    fetchAllExercises,
  };
};

export default useSplitExercises;
