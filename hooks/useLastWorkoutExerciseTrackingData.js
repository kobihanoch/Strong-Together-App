import { useEffect, useState } from "react";
import { useAnalysisContext } from "../context/AnalysisContext";

const useLastWorkoutExerciseTrackingData = (exerciseToSplitId) => {
  const [lastWorkoutData, setLastWorkoutData] = useState(null);
  const { exerciseTracking } = useAnalysisContext();

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
