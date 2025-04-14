import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useUserWorkout } from "../hooks/useUserWorkout";
import useExercises from "../hooks/useExercises";

const CreateWorkoutContext = createContext();

export const useCreateWorkout = () => useContext(CreateWorkoutContext);

export const CreateWorkoutProvider = ({ children }) => {
  // ----------------------------Saving----------------------------
  const [canSave, setCanSave] = useState(false);

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

  // If user has a workout: NEED TO ADD A FUNCTION THAT ARRANGES THE GIVEN DATA OF USER AND TRANSLATES IT TO THIS DATA STRUCTURE
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
  const [focusedSplit, setFocusedSplit] = useState(null);
  const [filteredExercises, setFilteredExercises] = useState(null);
  const [muscles, setMuscles] = useState(null);

  // Update muscles
  useEffect(() => {
    setMuscles(getMuscles(dbExercises));
  }, [dbExercises]);

  // Set filtered exercises by muscle (first)
  useEffect(() => {
    if (dbExercises && muscles) {
      //console.log(filterExercisesByMuscle(muscles[0], dbExercises));
      setFilteredExercises(filterExercisesByMuscle(muscles[0], dbExercises));
    }
  }, [muscles, dbExercises]);

  // Update the selected exercises array
  useEffect(() => {
    console.log("🟡 splitsNumber changed:", splitsNumber);
    const newSelectedExercisesArr = createNamedLetterArray(splitsNumber);
    setSelectedExercises(newSelectedExercisesArr);
  }, [splitsNumber]);

  useEffect(() => {
    if (focusedSplit) {
      console.log("🎯 focusedSplit changed:", focusedSplit?.name);
    }
  }, [focusedSplit]);

  // Updates when all the splits are not empty
  useEffect(() => {
    const allSplitsHaveExercises = selectedExercises.every(
      (split) => split.exercises.length > 0
    );

    setCanSave(allSplitsHaveExercises);
    console.log("🔵 selectedExercises changed:", selectedExercises);
  }, [selectedExercises]);

  const createNamedLetterArray = (count) => {
    return Array.from({ length: count }, (_, i) => {
      const letter = String.fromCharCode(65 + i); // 65 = 'A'
      return { name: letter, exercises: [] };
    });
  };

  // ----------------------------Utils----------------------------

  const filterExercisesByMuscle = (muscle, exercises) => {
    const dup = exercises.filter((ex) => ex.targetmuscle === muscle);
    //console.log(dup);
    return dup;
  };

  const getMuscles = (exercises) => {
    let musclesSet = new Set();
    exercises.forEach((ex) => {
      musclesSet.add(ex.targetmuscle);
    });

    const musclesArray = Array.from(musclesSet);
    console.log(musclesArray);
    return musclesArray;
  };

  const filterExercisesByFirstMuscle = () => {
    setFilteredExercises(filterExercisesByMuscle(muscles[0], dbExercises));
  };

  const toggleExerciseInSplit = (exercise, isSelected) => {
    const arrayOfSplits = JSON.parse(JSON.stringify(selectedExercises));
    arrayOfSplits.forEach((split) => {
      if (split.name == focusedSplit.name) {
        const isSelectedArr = split.exercises.filter(
          (ex) => ex.exercise_id !== exercise.id
        );
        const isNotSelectedArr = [
          ...split.exercises,
          {
            exercise_id: exercise.id,
            workoutsplit_id: null,
            sets: [10, 10, 10],
          },
        ];
        isSelected
          ? (split.exercises = isSelectedArr)
          : (split.exercises = isNotSelectedArr);
      }
      setSelectedExercises(arrayOfSplits);
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
          focusedSplit,
          setFocusedSplit,
          filteredExercises,
          setFilteredExercises,
          muscles,
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
        utils: {
          filterExercisesByMuscle,
          getMuscles,
          filterExercisesByFirstMuscle,
          toggleExerciseInSplit,
        },
        saving: {
          canSave,
        },
      }}
    >
      {children}
    </CreateWorkoutContext.Provider>
  );
};
