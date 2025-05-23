import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import useExercises from "../hooks/useExercises";
import { useUserWorkout } from "../hooks/useUserWorkout";
import {
  addExercisesToSplit,
  updateExercisesToSplit,
} from "../services/SplitExerciseService";
import {
  addWorkout,
  deleteWorkout,
  getUserWorkout,
} from "../services/WorkoutService";
import { addWorkoutSplits } from "../services/WorkoutSplitsService";
import { useAuth } from "./AuthContext";
import { useNavigation } from "@react-navigation/native";
import MyWorkoutPlan from "../screens/MyWorkoutPlan";
import { splitTheWorkout } from "../utils/sharedUtils";

const CreateWorkoutContext = createContext();

export const useCreateWorkout = () => useContext(CreateWorkoutContext);

export const CreateWorkoutProvider = ({ children }) => {
  // ----------------------------Navigation----------------------------
  const navigation = useNavigation();

  // ----------------------------Saving----------------------------
  const [canSave, setCanSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ----------------------------User----------------------------
  const { user, workout: workoutFromAuth } = useAuth();

  // ----------------------------Exercises in DB----------------------------
  const {
    exercises: dbExercises,
    error: exError,
    loading: exLoading,
  } = useExercises();

  // ----------------------------Fetched workout--------------------------------
  const {
    workout,
    setWorkout,
    workoutSplits,
    setWorkoutSplits,
    exercises,
    setExercises,
  } = workoutFromAuth;
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
            .map(({ id, exercise_id, sets, workoutsplit_id }) => ({
              id,
              exercise_id,
              sets,
              workoutsplit_id,
            })),
        })
      );
      //console.log(JSON.stringify(newSeletecExercises, null, 2));
      setSelectedExercises(newSeletecExercises);
      setCurrentStep(2);
    } else {
      setIsNewWorkout(true);
    }
  }, [workoutFromAuth]);

  // ----------------------------Step----------------------------
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    console.log("🟢 currentStep changed:", currentStep);
  }, [currentStep]);

  // ----------------------------Workout properties----------------------------
  const [isNewWorkout, setIsNewWorkout] = useState(false);
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
    if (isNewWorkout) {
      console.log("🟡 splitsNumber changed:", splitsNumber);
      const newSelectedExercisesArr = createNamedLetterArray(splitsNumber);
      setSelectedExercises(newSelectedExercisesArr);
    }
  }, [splitsNumber, isNewWorkout]);

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
              id: null, // New exercise id is null
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

  const saveWorkout = async () => {
    setIsSaving(true);
    let hasError = false;
    try {
      // Create new
      if (isNewWorkout) {
        // If has already workout delete the first one
        if (workout) {
          console.log("Got here");
          await deleteWorkout(user.id);
          console.log("Got here 2");
        }
        // Create a new workout plan and get the id
        try {
          const { data: workoutPlan } = await addWorkout(
            user.id,
            "Power",
            splitsNumber
          );

          //const newWorkoutId = workoutPlan?.id;
          console.log("New workout plan created with id: ", workoutPlan.id);

          // Create new workout splits and get IDs
          const splitsArray = selectedExercises.map((split) => {
            return { name: split.name, workout_id: workoutPlan.id };
          });
          const workoutSplitsIds = await addWorkoutSplits(splitsArray); // Returns all object, not only id
          console.log("New workout splits ids: ", workoutSplitsIds);

          // Add the exercises to it
          const exercisesArray = selectedExercises.flatMap((split, index) => {
            const splitId = workoutSplitsIds[index];

            return split.exercises.map((exercise) => ({
              exercise_id: exercise.exercise_id,
              sets: exercise.sets,
              workoutsplit_id: splitId,
            }));
          });
          await addExercisesToSplit(exercisesArray);

          //console.log("V!!!!!!!! :)");
        } catch (e) {
          hasError = true;
          console.error(e);
          Alert.alert(e);
        }
      }
      // Update existing workout
      else {
        try {
          await updateExercisesToSplit(selectedExercises, exercises, user.id); // Give new and old arrays to compare
        } catch (e) {
          console.error(e);
        }
      }

      // Fetch all from DB and assign to cache
      const fetchedWorkoutPlan = await getUserWorkout(user.id);
      const {
        workout: w,
        workoutSplits: ws,
        exercises: exs,
      } = splitTheWorkout(fetchedWorkoutPlan);
      // Add to cache (Auth context)
      setWorkout(w);
      setWorkoutSplits(ws);
      setExercises(exs);
    } catch (e) {
      console.error(e);
      Alert.alert(e);
    } finally {
      if (!hasError) {
        navigation.navigate("MyWorkoutPlan");
      }
      setIsSaving(false);
    }
  };

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
          setIsNewWorkout,
        },
        userWorkout: {
          workout,
          workoutSplits,
          exercises,
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
          isSaving,
          saveWorkout,
        },
      }}
    >
      {children}
    </CreateWorkoutContext.Provider>
  );
};
