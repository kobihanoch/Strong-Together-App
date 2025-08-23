import { useState, useEffect, useMemo } from "react";
import { useGlobalAppLoadingContext } from "../../context/GlobalAppLoadingContext";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useWorkoutContext } from "../../context/WorkoutContext";

const useAnalysticsLogic = () => {
  const { isLoading: globalLoading } = useGlobalAppLoadingContext();
  const { analyzedExerciseTrackingData } = useAnalysisContext();
  const { workoutCount = 0, splitDaysByName: splitsCounter = new Map() } =
    analyzedExerciseTrackingData ?? {};
  const { workout } = useWorkoutContext();
  const loading = globalLoading || !analyzedExerciseTrackingData || !workout;

  return {
    data: {
      overview: {
        workoutCount: workoutCount,
        splitsCounter: splitsCounter,
        workoutPlan: workout,
      },
    },
    loading: loading,
  };
};

export default useAnalysticsLogic;
