import { useMemo } from "react";
import { useAnalysisContext } from "../context/AnalysisContext";

const useLastWorkoutExerciseTrackingData = (exerciseToSplitId) => {
  const { exerciseTrackingMaps } = useAnalysisContext();
  const lastWorkoutData = useMemo(() => {
    const allRecords = exerciseTrackingMaps?.byETSId?.[exerciseToSplitId];
    if (!allRecords) return null;
    return exerciseTrackingMaps?.byETSId?.[exerciseToSplitId][0];
  }, [exerciseTrackingMaps, exerciseToSplitId]);

  return { lastWorkoutData };
};

export default useLastWorkoutExerciseTrackingData;
