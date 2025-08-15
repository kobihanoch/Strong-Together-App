import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { getUserWorkout } from "../services/WorkoutService";
import { extractWorkoutSplits } from "../utils/sharedUtils";
import { useAuth } from "./AuthContext";

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
  const { user, sessionLoading } = useAuth();

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
    if (sessionLoading) {
      setLoading(true);
      return;
    }
    (async () => {
      // When user is not available (e.g., after logout), reset and stop
      if (!user?.id) {
        setWorkout(null);
        setWorkoutForEdit(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await getUserWorkout();
        const { workoutPlan, workoutPlanForEditWorkout } = data || {};
        setWorkout(workoutPlan ?? null);
        setWorkoutForEdit(workoutPlanForEditWorkout ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

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
