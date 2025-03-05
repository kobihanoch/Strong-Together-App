import { useState, useEffect } from "react";
import {
  fetchWorkoutSplitsByWorkoutId,
  addWorkoutSplit,
  updateWorkoutSplit,
  deleteWorkoutSplit,
} from "../services/WorkoutSplitsService";

const useWorkoutSplits = (workoutId) => {
  const [workoutSplits, setWorkoutSplits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSplits = async (workoutId) => {
    setLoading(true);
    try {
      if (workoutId) {
        const splits = await fetchWorkoutSplitsByWorkoutId(workoutId);
        setWorkoutSplits(splits);
      } else {
      }
    } catch (error) {
      console.error("Error fetching splits:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSplits();
  }, [workoutId]);

  const createWorkoutSplit = async (name, createdAt) => {
    setLoading(true);
    try {
      const newSplit = await addWorkoutSplit(workoutId, name, createdAt);
      setWorkoutSplits((prev) => [...prev, newSplit]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const modifyWorkoutSplit = async (id, name, createdAt) => {
    setLoading(true);
    try {
      const updatedSplit = await updateWorkoutSplit(id, name, createdAt);
      setWorkoutSplits((prev) =>
        prev.map((split) => (split.id === id ? updatedSplit : split))
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeWorkoutSplit = async (id) => {
    setLoading(true);
    try {
      await deleteWorkoutSplit(id);
      setWorkoutSplits((prev) => prev.filter((split) => split.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    workoutSplits,
    error,
    loading,
    fetchSplits,
    createWorkoutSplit,
    modifyWorkoutSplit,
    removeWorkoutSplit,
  };
};

export default useWorkoutSplits;
