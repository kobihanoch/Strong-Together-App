import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useUserWorkout } from "../hooks/useUserWorkout";
import useExercises from "../hooks/useExercises";

const CreateWorkoutContext = createContext();

export const useCreateWorkout = () => useContext(CreateWorkoutContext);

export const CreateWorkoutProvider = ({ children }) => {
  // ----------------------------User----------------------------
  const { user } = useAuth();

  // ----------------------------Exercises in DB----------------------------
  const {
    exercises: dbExercises,
    error: exError,
    loading: exLoading,
  } = useExercises();

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

  // Update the selected exercises array
  useEffect(() => {
    console.log("🟡 splitsNumber changed:", splitsNumber);
    const newSelectedExercisesArr = createNamedLetterArray(splitsNumber);
    setSelectedExercises(newSelectedExercisesArr);
  }, [splitsNumber]);

  useEffect(() => {
    console.log("🔵 selectedExercises changed:", selectedExercises);
  }, [selectedExercises]);

  const createNamedLetterArray = (count) => {
    return Array.from({ length: count }, (_, i) => {
      const letter = String.fromCharCode(65 + i); // 65 = 'A'
      return { name: letter };
    });
  };

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
        DB: {
          dbExercises,
          exLoading,
          exError,
        },
      }}
    >
      {children}
    </CreateWorkoutContext.Provider>
  );
};
