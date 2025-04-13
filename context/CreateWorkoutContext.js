import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useUserWorkout } from "../hooks/useUserWorkout";

const CreateWorkoutContext = createContext();

export const useCreateWorkout = () => useContext(CreateWorkoutContext);

export const CreateWorkoutProvider = ({ children }) => {
  // ----------------------------User----------------------------
  const { user } = useAuth();

  // ----------------------------Fetched workout--------------------------------
  const { workout, workoutSplits, exercises, loading, error } = useUserWorkout(
    user?.id
  );

  // If user has a workout
  useEffect(() => {
    if (workout && workoutSplits && exercises) {
      setCurrentStep(2);
    }
  }, [workout, workoutSplits, exercises]);

  // ----------------------------Step----------------------------
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    console.log("🟢 currentStep changed:", currentStep);
  }, [currentStep]);

  // ----------------------------Workout properties----------------------------
  const [splitsNumber, setSplitsNumber] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    console.log("🟡 splitsNumber changed:", splitsNumber);
  }, [splitsNumber]);

  useEffect(() => {
    console.log("🔵 selectedExercises changed:", selectedExercises);
  }, [selectedExercises]);

  //------------------------------------------------------------------------------------

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
