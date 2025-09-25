import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { keyWorkoutPlan } from "../cache/cacheUtils";
import useCacheAndFetch from "../hooks/useCacheAndFetch";
import useUpdateGlobalLoading from "../hooks/useUpdateGlobalLoading";
import { getUserWorkout } from "../services/WorkoutService";
import { extractWorkoutSplits } from "../utils/workoutContextUtils";
import { useAuth } from "./AuthContext";
import { hasBootstrapPayload } from "../api/bootstrapApi";

const WorkoutContext = createContext(null);
export const useWorkoutContext = () => {
  const ctx = useContext(WorkoutContext);
  if (!ctx)
    throw new Error("useWorkoutContext must be used within a WorkoutProvider");
  return ctx;
};

/**
 * Workout Context
 * ----------------
 * Responsibilities:
 * - Fetch and hold the user's active workout plan
 * - Derive mapped splits + flat exercises
 * - Provide an editable copy (workoutForEdit)
 */

export const WorkoutProvider = ({ children }) => {
  const { user, isValidatedWithServer } = useAuth();

  // Raw workout plan from API
  const [workout, setWorkout] = useState(null);

  // Derived data from workout
  const { workoutSplits, exercises } = useMemo(() => {
    return extractWorkoutSplits(workout); // must be null-safe
  }, [workout]);

  // Editable version for edit workout
  const [workoutForEdit, setWorkoutForEdit] = useState(null);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getUserWorkout(), []);

  // On data function
  const onDataFn = useCallback((data) => {
    setWorkout(data?.workoutPlan ?? null);
    setWorkoutForEdit(data?.workoutPlanForEditWorkout ?? null);
  }, []);

  // Cache payload
  const cachePayload = useMemo(
    () => ({ workoutPlan: workout, workoutPlanForEditWorkout: workoutForEdit }),
    [workout, workoutForEdit]
  );

  // Hook usage
  const { loading, cacheKnown } = useCacheAndFetch(
    user, // user prop
    keyWorkoutPlan, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    "Workout Context" // log
  );

  // Report workout plan loading to global loading
  useUpdateGlobalLoading("WorkoutPlan", cacheKnown ? loading : true);

  // Memoized context value
  const value = useMemo(
    () => ({
      workout,
      setWorkout,
      workoutSplits, // [{name: A, id: 1, muscle_group:...}, {name: B, id: 2. muscle_group:...},....], exercises = {A: [exercises...], B: [exercises...]}}
      exercises, // { A: [...], B: [...], ... }
      workoutForEdit,
      setWorkoutForEdit,
      loading,
    }),
    [workout, workoutSplits, exercises, workoutForEdit, loading]
  );

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};
