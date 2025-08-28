import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { keyWorkoutPlan, TTL_48H } from "../cache/cacheUtils";
import useGetCache from "../hooks/useGetCache";
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

  const { user, isValidatedWithServer } = useAuth();

  // Stable cache key
  const planKey = useMemo(
    () => (user ? keyWorkoutPlan(user.id) : null),
    [user?.id]
  );

  // Get cache
  // Triggers on plan key builded
  const { cached, hydrated: cacheHydrated } = useGetCache(planKey);

  // Raw workout plan from API
  const [workout, setWorkout] = useState(null);

  // Derived data from workout
  const { workoutSplits, exercises } = useMemo(() => {
    return extractWorkoutSplits(workout); // must be null-safe
  }, [workout]);

  // Editable version for edit workout
  const [workoutForEdit, setWorkoutForEdit] = useState(null);

  // Loading flag for this context
  const [loading, setLoading] = useState(false);

  // Flag for API data hydration to enable cache writing
  // Flag stays true until context is unmounting on logout (guard against initial refrence building)
  const [APIDataHydrated, setAPIDataHydrated] = useState(false);

  // Cache payload
  const cachedPayload = useMemo(() => {
    return {
      workoutPlan: workout,
      workoutPlanForEditWorkout: workoutForEdit,
    };
  }, [workout, workoutForEdit]);
  useUpdateCache(planKey, cachedPayload, TTL_48H, APIDataHydrated);

  /*useEffect(() => {
    console.log("Workout Mounted");
  }, []);*/

  // Load from cache and from server
  useEffect(() => {
    (async () => {
      if (cacheHydrated && planKey) {
        try {
          // Check if cached
          if (cached) {
            console.log("[Workout Context]: Cached");
            setWorkout(cached.workoutPlan ?? null);
            setWorkoutForEdit(cached.workoutPlanForEditWorkout ?? null);
            setLoading(false);
          } else {
            setLoading(true);
          }
        } finally {
        }
      }
    })();

    return logoutCleanup;
  }, [cacheHydrated, planKey]);

  // Run only after validating tokens at auth context
  useEffect(() => {
    (async () => {
      if (isValidatedWithServer) {
        try {
          // Call API
          const { data } = await getUserWorkout();
          const { workoutPlan, workoutPlanForEditWorkout } = data || {};

          setWorkout(workoutPlan ?? null);
          setWorkoutForEdit(workoutPlanForEditWorkout ?? null);
          setAPIDataHydrated(true);

          // Store in cache (auto)
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [isValidatedWithServer]);

  useEffect(() => {
    setGlobalLoading("workout", loading);
    return () => setGlobalLoading("workout", false);
  }, [loading]);

  const logoutCleanup = useCallback(() => {
    setWorkout(null);
    setWorkoutForEdit(null);
    setLoading(false);
    setAPIDataHydrated(false);
    //console.log("Workout Unmounted");
  }, []);

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
