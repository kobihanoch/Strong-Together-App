import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const useLastWorkoutExerciseTrackingData = (exerciseToSplitId) => {
  const [lastWorkoutData, setLastWorkoutData] = useState(null);
  const { workout } = useAuth();
  const { exerciseTracking } = workout;

  useEffect(() => {
    if (exerciseTracking) {
      // Get last performence of the specific exercise
      setLastWorkoutData(() => {
        return exerciseTracking
          .filter((et) => Number(et.exercisetosplit_id) === exerciseToSplitId)
          .pop();
      });
    }
  }, [exerciseToSplitId, exerciseTracking]);

  return { lastWorkoutData };
};

export default useLastWorkoutExerciseTrackingData;
