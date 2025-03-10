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

  // Fetch all splits for a given workout ID
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

  // Fetch a specific workout split by its ID
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

  // Add a new workout split
  const createWorkoutSplit = async (workoutId, name) => {
    setLoading(true);
    try {
      const createdAt = new Date().toISOString();
      const newSplit = await addWorkoutSplit(workoutId, name, createdAt);
      setWorkoutSplits((prev) => [...prev, ...newSplit]); // Updating state with the new split
      return newSplit;
    } catch (error) {
      console.error("Error adding workout split:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing workout split
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

  // Remove a workout split
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
