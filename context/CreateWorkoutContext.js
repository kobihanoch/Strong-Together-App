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
    //console.log("User has workout?", workout != null);
    if (exercises) {
      setIsNewWorkout(false);
      const newSeletecExercises = [];
      const exCopy = JSON.parse(JSON.stringify(exercises));

      workoutSplits.forEach((split) =>
        newSeletecExercises.push({
          name: split.name,
          exercises: exCopy
            .filter((ex) => ex.workoutsplit === split.name)
            .map(({ exercise_id, sets, workoutsplit_id }) => ({
              exercise_id,
              sets,
              workoutsplit_id,
            })),
        })
      );
      //console.log(JSON.stringify(newSeletecExercises, null, 2));
      setSelectedExercises(newSeletecExercises);
      setCurrentStep(2);
    }
  }, [exercises]);

  // ----------------------------Step----------------------------
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    console.log("🟢 currentStep changed:", currentStep);
  }, [currentStep]);

  // ----------------------------Workout properties----------------------------
  const [isNewWorkout, setIsNewWorkout] = useState(true);
  const [splitsNumber, setSplitsNumber] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [focusedSplit, setFocusedSplit] = useState(null);
  const [filteredExercises, setFilteredExercises] = useState(null);
  const [muscles, setMuscles] = useState(null);
  const [focusedExercise, setFocusedExercise] = useState(null);
  const [focusedExerciseSets, setFocusedExerciseSets] = useState(null);

  // When an exercise is being selected, autoomatifly update the focused exercise sets state
  useEffect(() => {
    if (focusedExercise) {
      console.log("🎯 focusedExercise changed:", focusedExercise);
      const sets = // Filter selected exercises array to set
        selectedExercises
          .find((split) => split.name === focusedSplit?.name)
          ?.exercises.find(
            (ex) => ex.exercise_id === focusedExercise?.id
          )?.sets;

      //console.log(sets);
      setFocusedExerciseSets(sets);
    }
  }, [focusedExercise]);

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
    console.log(
      "🔵 selectedExercises changed:",
      JSON.stringify(selectedExercises, null, 2)
    );
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

  // When toggling from not selected, default value for sets is [10, 10, 10]
  const toggleExerciseInSplit = (exercise, isSelected) => {
    const updated = selectedExercises.map((split) => {
      if (split.name !== focusedSplit.name) return split;

      const isExerciseAlreadyInSplit = split.exercises.some(
        (ex) => ex.exercise_id === exercise.id
      );

      const newExercises = isSelected
        ? split.exercises.filter((ex) => ex.exercise_id !== exercise.id)
        : [
            ...split.exercises,
            {
              exercise_id: exercise.id,
              workoutsplit_id: null,
              sets: [10, 10, 10],
            },
          ];

      return { ...split, exercises: newExercises };
    });

    setSelectedExercises(updated);
  };

  // Focused sets is updated after setting focused exercise - after entering the modal
  const updateSetsForExercise = (exercise, inputSets) => {
    const updated = selectedExercises.map((split) => {
      if (split.name !== focusedSplit.name) return split;
      const updatedExercises = split.exercises.map((ex) =>
        ex.exercise_id === exercise.id ? { ...ex, sets: inputSets } : ex
      );

      return { ...split, exercises: updatedExercises };
    });

    setSelectedExercises(updated);
  };

  useEffect(() => {
    console.log(
      "Current sets for exercise",
      focusedExercise?.name,
      ":",
      focusedExerciseSets
    );
  }, [focusedExerciseSets]);

  //------------------------------------------------------------------------------------

  return (
    <CreateWorkoutContext.Provider
      value={{
        properties: {
          isNewWorkout,
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
          focusedExercise,
          setFocusedExercise,
          focusedExerciseSets,
          setFocusedExerciseSets,
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
          updateSetsForExercise,
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
