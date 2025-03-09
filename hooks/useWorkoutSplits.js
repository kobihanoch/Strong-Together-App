import { useState, useEffect } from "react";
import {
  fetchWorkoutSplitsByWorkoutId,
  addWorkoutSplit,
  updateWorkoutSplit,
  deleteWorkoutSplit,
  fetchWorkoutSplitById,
} from "../services/WorkoutSplitsService";

const useWorkoutSplits = (workoutId) => {
  const [workoutSplits, setWorkoutSplits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSplits = async (workoutId) => {
    setLoading(true);
    console.log("Fetching splits for workoutId:", workoutId);
    try {
      if (workoutId) {
        const splits = await fetchWorkoutSplitsByWorkoutId(workoutId);
        setWorkoutSplits(splits);
        console.log("Fetched data:", splits);
      }
    } catch (error) {
      console.error("Error fetching splits:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get workout split by workout split id
  const fetchWorkoutSplit = async (id) => {
    setLoading(true);
    try {
      const split = await fetchWorkoutSplitById(id);
      return split;
    } catch (error) {
      console.error("Error fetching workout split:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSplits(workoutId);
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
    fetchWorkoutSplit,
    createWorkoutSplit,
    modifyWorkoutSplit,
    removeWorkoutSplit,
  };
};

export default useWorkoutSplits;
