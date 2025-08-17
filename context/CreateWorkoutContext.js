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

        // Prevent duplicates (by id if present, else by name field fallback)
        const exists = ex.id
          ? current.some((e) => e.id === ex.id)
          : current.some((e) => e.exercise === ex.exercise);
        if (exists) return prev;

        // Append to end; order_index is 0-based -> next index is current.length
        const appended = {
          ...ex,
          order_index: current.length, // last index after append (0-based)
          // optional defaults if needed:
          // sets: Array.isArray(ex.sets) ? ex.sets : [],
        };

        return {
          ...prev,
          [editedSplit]: [...current, appended],
        };
      });
    },
    [editedSplit]
  );

  // Remove exercise from the current split
  const removeExercise = useCallback(
    (exOrId) => {
      setSelectedExercises((prev) => {
        const key = editedSplit;
        const list = prev?.[key] ?? [];

        // 1) Prefer removing by id (coerce to string on both sides)
        const idToRemove =
          typeof exOrId === "object" && exOrId !== null ? exOrId.id : exOrId;

        let next;

        if (idToRemove != null) {
          const idStr = String(idToRemove);
          next = list.filter((it) => String(it?.id) !== idStr);
        } else if (typeof exOrId === "object" && exOrId?.name) {
          // 2) Fallback: remove by name if id is missing
          next = list.filter((it) => it?.name !== exOrId.name);
        } else if (
          typeof exOrId === "object" &&
          typeof exOrId?.order_index === "number"
        ) {
          // 3) Last resort: remove by order_index
          next = list.filter((_, i) => i !== exOrId.order_index);
        } else {
          // Nothing to remove
          return prev;
        }

        // Normalize order_index to 0-based after removal
        const reindexed = next.map((it, i) => ({ ...it, order_index: i }));

        return { ...prev, [key]: reindexed };
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
