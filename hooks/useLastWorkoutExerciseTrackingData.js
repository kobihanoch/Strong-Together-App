import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const useLastWorkoutExerciseTrackingData = (exerciseToSplitId) => {
  const [lastWorkoutData, setLastWorkoutData] = useState(null);
  const { workout } = useAuth();
  const { exerciseTracking } = workout;

  useEffect(() => {
    if (exerciseTracking) {
      setLastWorkoutData(() => {
        return exerciseTracking
          .filter((et) => et.exercisetosplit_id === exerciseToSplitId)
          .pop();
      });
    }
  }, [exerciseToSplitId, exerciseTracking]);

  return { lastWorkoutData };
};

export default useLastWorkoutExerciseTrackingData;
