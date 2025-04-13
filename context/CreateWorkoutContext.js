import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useUserWorkout } from "../hooks/useUserWorkout";

const CreateWorkoutContext = createContext();

export const useCreateWorkout = () => useContext(CreateWorkoutContext);

// Provider
export const CreateWorkoutProvider = ({ children }) => {
  // User
  const { user } = useAuth();

  // Fetched workout
  const { workout, workoutSplits, exercises, loading, error } = useUserWorkout(
    user?.id
  );

  // Step
  const [currentStep, setCurrentStep] = useState(0);

  // Workout properties
  const [splitsNumber, setSplitsNumber] = useState(0);

  // Workout splits exercises
  const [selectedExercises, setSelectedExercises] = useState([]);

  return (
    <CreateWorkoutContext.Provider
      value={{
        properties: {
          currentStep,
          setCurrentStep,
          splitsNumber,
          setSplitsNumber,
          selectedExercises,
          setSelectedExercises,
        },
        userWorkout: {
          workout,
          workoutSplits,
          exercises,
          loading,
          error,
        },
      }}
    >
      {children}
    </CreateWorkoutContext.Provider>
  );
};
