// English comments only inside code

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

  useEffect(() => {
    console.log(JSON.stringify(selectedExercises, null, 2));
  }, [selectedExercises]);

  // ----------------------------Rules for sets----------------------------
  // Reps constraints and defaults
  const REPS_MIN = 1;
  const REPS_MAX = 20;
  const DEFAULT_SETS = [10, 10, 10];

  // Clamp an array of sets to length=3 and values within [REPS_MIN, REPS_MAX]
  const clampSetsToRules = useCallback(
    (sets) => {
      const base = Array.isArray(sets) ? sets.slice(0, 3) : [];
      const padded =
        base.length < 3
          ? [...base, ...Array(3 - base.length).fill(DEFAULT_SETS[0])]
          : base;
      return padded.map((n) => {
        const v = Number.isFinite(n) ? n : DEFAULT_SETS[0];
        return Math.max(REPS_MIN, Math.min(REPS_MAX, v));
      });
    },
    [REPS_MIN, REPS_MAX]
  );

  // ----------------------------Existing workout----------------------------
  const { workoutForEdit: workout } = useWorkoutContext();

  // Return the exercises for the currently edited split
  const selectedExercisesForSplit = useMemo(() => {
    return selectedExercises?.[editedSplit] ?? [];
  }, [editedSplit, selectedExercises, workout]);

  // Add exercise to the current split (no duplicates by id/name)
  const addExercise = useCallback(
    (ex) => {
      setSelectedExercises((prev) => {
        const current = prev?.[editedSplit] ?? [];

        // Prevent duplicates (by id if present, else by name field fallback)
        const exists = ex?.id
          ? current.some((e) => String(e.id) === String(ex.id))
          : current.some((e) => e?.exercise === ex?.exercise);
        if (exists) return prev;

        // Ensure sets follow rules (default to [10,10,10])
        const safeSets = clampSetsToRules(ex?.sets ?? DEFAULT_SETS);

        // Append to end; order_index is 0-based
        const appended = {
          ...ex,
          order_index: current.length,
          sets: safeSets,
        };

        return {
          ...prev,
          [editedSplit]: [...current, appended],
        };
      });
    },
    [editedSplit, clampSetsToRules]
  );

  // Remove exercise from the current split
  const removeExercise = useCallback(
    (exOrId) => {
      setSelectedExercises((prev) => {
        const key = editedSplit;
        const list = prev?.[key] ?? [];

        const idToRemove =
          typeof exOrId === "object" && exOrId !== null ? exOrId.id : exOrId;

        let next;

        if (idToRemove != null) {
          const idStr = String(idToRemove);
          next = list.filter((it) => String(it?.id) !== idStr);
        } else if (typeof exOrId === "object" && exOrId?.name) {
          next = list.filter((it) => it?.name !== exOrId.name);
        } else if (
          typeof exOrId === "object" &&
          typeof exOrId?.order_index === "number"
        ) {
          next = list.filter((_, i) => i !== exOrId.order_index);
        } else {
          return prev;
        }

        // Normalize order_index to 0-based after removal
        const reindexed = next.map((it, i) => ({ ...it, order_index: i }));

        return { ...prev, [key]: reindexed };
      });
    },
    [editedSplit]
  );

  // Adjust user's assigned workout from DB to context
  const hasWorkout = useMemo(() => workout != null, [workout]);

  useEffect(() => {
    if (hasWorkout) {
      // Optionally ensure imported workout sets are clamped to rules
      // If your DB is always valid, you can skip this normalization
      setSelectedExercises((prev) => {
        const incoming = workout || prev;
        const next = {};
        Object.keys(incoming || {}).forEach((splitKey) => {
          next[splitKey] = (incoming[splitKey] || []).map((ex, idx) => ({
            ...ex,
            // Keep existing order_index if present; otherwise index
            order_index:
              typeof ex?.order_index === "number" ? ex.order_index : idx,
            // Clamp sets from DB to rules
            sets: clampSetsToRules(ex?.sets ?? DEFAULT_SETS),
          }));
        });
        return next;
      });
    }
  }, [workout, hasWorkout, clampSetsToRules]);

  // Debug
  // useEffect(() => {
  //   console.log(JSON.stringify(selectedExercises, null, 2));
  // }, [selectedExercises]);

  // Extract all the splits from selected exercises
  const workoutSplits = useMemo(() => {
    return Object.keys(selectedExercises);
  }, [selectedExercises]);

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
      utils: {
        REPS_MIN,
        REPS_MAX,
        DEFAULT_SETS,
        clampSetsToRules,
      },
      saving: { setIsSaving },
    }),
    [
      hasWorkout,
      isSaving,
      workout,
      editedSplit,
      selectedExercisesForSplit,
      selectedExercises,
      addExercise,
      removeExercise,
      dbExercises,
      exError,
      exLoading,
      REPS_MIN,
      REPS_MAX,
      clampSetsToRules,
    ]
  );

  return (
    <CreateWorkoutContext.Provider value={contextValue}>
      {children}
    </CreateWorkoutContext.Provider>
  );
};
