import { createContext, useContext, useMemo, useState } from "react";
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

  // Fetch workout on load
  useEffect(() => {
    (async () => {
      const { data } = await getUserWorkout();
      const { workoutPlan, workoutPlanForEditWorkout } = data;
      setWorkout(workoutPlan);
      setWorkoutForEdit(workoutPlanForEditWorkout);
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
    }),
    [workout, workoutSplits, exercises, workoutForEdit]
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
