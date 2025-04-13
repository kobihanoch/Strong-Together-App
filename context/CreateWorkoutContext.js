import React, { createContext, useContext, useState } from "react";

const CreateWorkoutContext = createContext();

export const useCreateWorkout = () => useContext(CreateWorkoutContext);

// Provider
export const CreateWorkoutProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  // Workout properties
  const [splitsNumber, setSplitsNumber] = useState(0);

  // Workout splits exercises
  const [selectedExercises, setSelectedExercises] = useState([]);

  return (
    <CreateWorkoutContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        workoutName,
        splitsNumber,
        setSplitsNumber,
        selectedExercises,
        setSelectedExercises,
      }}
    >
      {children}
    </CreateWorkoutContext.Provider>
  );
};
