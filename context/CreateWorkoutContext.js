import { useNavigation } from "@react-navigation/native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useExercises from "../hooks/useExercises";
import { useWorkoutContext } from "./WorkoutContext";

const CreateWorkoutContext = createContext(null);

export const useCreateWorkout = () => useContext(CreateWorkoutContext);

export const CreateWorkoutProvider = ({ children }) => {
  // ----------------------------Navigation----------------------------
  const navigation = useNavigation();

  // ----------------------------Saving----------------------------
  const [isSaving, setIsSaving] = useState(false);

  // ----------------------------Editing----------------------------
  const [editedSplit, setEditedSplit] = useState("A"); // Currently edited split

  // Keep a map: { splitName: [...Exercises] }
  const [selectedExercises, setSelectedExercises] = useState({ A: [] });

  // Return the exercises for the currently edited split
  const selectedExercisesForSplit = useMemo(() => {
    // Always return an array
    return selectedExercises?.[editedSplit] ?? [];
  }, [editedSplit, selectedExercises, workout]);

  // Add exercise to the current split (no duplicates by id/name)
  const addExercise = useCallback(
    (ex) => {
      setSelectedExercises((prev) => {
        const current = prev?.[editedSplit] ?? [];
        const exists = ex.id
          ? current.some((e) => e.id === ex.id)
          : current.some((e) => e.exercise === ex.exercise);
        if (exists) return prev; // no change

        return {
          ...prev,
          [editedSplit]: [...current, ex],
        };
      });
    },
    [editedSplit]
  );

  // Remove exercise from the current split
  const removeExercise = useCallback(
    (ex) => {
      setSelectedExercises((prev) => {
        const current = prev?.[editedSplit] ?? [];
        const next = ex.id
          ? current.filter((e) => e.id !== ex.id)
          : current.filter((e) => e.exercise !== ex.exercise);

        if (next.length === current.length) return prev; // nothing removed

        return {
          ...prev,
          [editedSplit]: next,
        };
      });
    },
    [editedSplit]
  );

  // ----------------------------Existing workout----------------------------
  const { workoutForEdit: workout } = useWorkoutContext();

  // Adjust user's assigned workout from DB to context
  useEffect(() => {
    if (hasWorkout) {
      setSelectedExercises(workout);
    }
  }, [workout]);

  useEffect(() => {
    console.log(JSON.stringify(selectedExercises, null, 2));
  }, [selectedExercises]);

  // Extract all the splits from selected exercises
  const workoutSplits = useMemo(() => {
    return Object.keys(selectedExercises);
  }, [selectedExercises]);

  // State for deciding has workout or not
  const hasWorkout = useMemo(() => workout != null, [workout]);

  // ----------------------------Exercises in DB----------------------------
  const {
    exercises: dbExercises,
    error: exError,
    loading: exLoading,
  } = useExercises();

  // ----------------------------Memoized context value----------------------------
  const contextValue = useMemo(
    () => ({
      properties: {
        hasWorkout,
        isSaving,
      },
      userWorkout: {
        workout,
        workoutSplits,
      },
      editing: {
        editedSplit,
        setEditedSplit,
        selectedExercisesForSplit,
        selectedExercises,
      },
      actions: {
        addExercise,
        removeExercise,
        setSelectedExercises,
      },
      DB: {
        dbExercises,
        exError,
        exLoading,
      },
      utils: {},
      saving: { setIsSaving },
    }),
    [
      hasWorkout,
      isSaving,
      workout,
      editedSplit,
      selectedExercisesForSplit,
      selectedExercises, // Workout to show to UI
      addExercise,
      removeExercise,
      dbExercises,
      exError,
      exLoading,
    ]
  );

  return (
    <CreateWorkoutContext.Provider value={contextValue}>
      {children}
    </CreateWorkoutContext.Provider>
  );
};
