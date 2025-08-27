import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cacheGetJSON, keyWorkoutPlan, TTL_48H } from "../cache/cacheUtils";
import useUpdateCache from "../hooks/useUpdateCache";
import { getUserWorkout } from "../services/WorkoutService";
import { extractWorkoutSplits } from "../utils/workoutContextUtils";
import { useAuth } from "./AuthContext";
import { useGlobalAppLoadingContext } from "./GlobalAppLoadingContext";

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
 * - Reset state when user logs out (user becomes null)
 */

export const WorkoutProvider = ({ children }) => {
  // Global loading
  const { setLoading: setGlobalLoading } = useGlobalAppLoadingContext();

  const { user, sessionLoading } = useAuth();

  // Stable cache key
  const planKey = useMemo(
    () => (user ? keyWorkoutPlan(user.id) : null),
    [user?.id]
  );

  // Raw workout plan from API
  const [workout, setWorkout] = useState(null);

  // Derived data from workout
  const { workoutSplits, exercises } = useMemo(() => {
    return extractWorkoutSplits(workout); // must be null-safe
  }, [workout]);

  // Editable version for edit workout
  const [workoutForEdit, setWorkoutForEdit] = useState(null);

  // Loading flag for this context
  const [loading, setLoading] = useState(true);

  // Fetch on mount and whenever user changes
  useEffect(() => {
    console.log("Workout Mounted");
    (async () => {
      if (user) {
        try {
          setLoading(true);
          // Check if cached
          const workoutPlanKey = keyWorkoutPlan(user.id);
          const cached = await cacheGetJSON(workoutPlanKey);
          if (cached) {
            console.log("Workout plan is cached!");
            setWorkout(cached.workoutPlan ?? null);
            setWorkoutForEdit(cached.workoutPlanForEditWorkout ?? null);
            return;
          }

          // If not cached fetch by API call
          const { data } = await getUserWorkout();
          const { workoutPlan, workoutPlanForEditWorkout } = data || {};
          setWorkout(workoutPlan ?? null);
          setWorkoutForEdit(workoutPlanForEditWorkout ?? null);

          // Store in cache - (auto)
        } finally {
          setLoading(false);
        }
      }
    })();

    return logoutCleanup;
  }, [user, sessionLoading]);

  useEffect(() => {
    setGlobalLoading("workout", loading);
    return () => setGlobalLoading("workout", false);
  }, [loading]);

  const logoutCleanup = useCallback(() => {
    setWorkout(null);
    setWorkoutForEdit(null);
    setLoading(false);
    console.log("Workout Unmounted");
  }, []);

  // Cache payload
  const cachedPayload = useMemo(() => {
    return {
      workoutPlan: workout,
      workoutPlanForEditWorkout: workoutForEdit,
    };
  }, [workout, workoutForEdit]);

  const enabled = !!user?.id && !loading;
  useUpdateCache(planKey, cachedPayload, TTL_48H, enabled);

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
