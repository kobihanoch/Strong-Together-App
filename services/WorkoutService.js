import api from "../api/api";
import supabase from "../src/supabaseClient";

// Fetch self workout plan
export const getUserWorkout = async () => {
  try {
    const response = await api.get("/api/workouts/getworkout");
    return response;
  } catch (error) {
    throw error;
  }
};

// Gets user exercise tracking data - including home page ata PR most common etc...
export const getUserExerciseTracking = async (userId) => {
  try {
    const response = await api.get("/api/workouts/gettracking");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Removes a workout plan
export const deleteWorkout = async () => {
  try {
    await api.delete("/api/workouts/delete");
  } catch (error) {
    throw error;
  }
};

// Add a new workout plan
export const addWorkout = async (workoutData) => {
  const { data } = await api.post("/api/workouts/add", {
    workoutData: workoutData,
  });
  return data;
};

// Saves a workout after working out - startworkout.js
export const saveWorkoutData = async (dataOfWorkout) => {
  if (!dataOfWorkout) {
    return;
  }
  const { data } = await api.post("/api/workouts/finishworkout", {
    workout: dataOfWorkout,
  });
  return data;
};
