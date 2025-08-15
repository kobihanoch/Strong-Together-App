import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getUserWorkout } from "../services/WorkoutService";
import { extractWorkoutSplits } from "../utils/sharedUtils";
import { useAuth } from "./AuthContext";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const { workoutSplits, exercises } = useMemo(() => {
    return extractWorkoutSplits(workout);
  }, [workout]);
  const [workoutForEdit, setWorkoutForEdit] = useState(null); // Same workout with map, for easier handling in edit workout mode
  const [loading, setLoading] = useState(false);

  // Fetch workout on load
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getUserWorkout();
      const { workoutPlan, workoutPlanForEditWorkout } = data;
      setWorkout(workoutPlan);
      setWorkoutForEdit(workoutPlanForEditWorkout);
      setLoading(false);
    })();
  }, [user]);

  const value = useMemo(
    () => ({
      workout,
      setWorkout,
      workoutSplits,
      exercises,
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

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkoutContext must be used within a WorkoutProvider");
  }
  return context;
};
