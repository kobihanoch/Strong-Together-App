import { useState, useEffect, useMemo } from "react";
import { useGlobalAppLoadingContext } from "../../context/GlobalAppLoadingContext";
import { useAnalysisContext } from "../../context/AnalysisContext";

const useAnalysticsLogic = () => {
  const { isLoading: globalLoading } = useGlobalAppLoadingContext();
  const { analyzedExerciseTrackingData } = useAnalysisContext();
  const { workoutCount = 0, splitDaysByName: splitsCounter = new Map() } =
    analyzedExerciseTrackingData ?? {};
  const loading = globalLoading || !analyzedExerciseTrackingData;

  return {
    data: {
      overview: { workoutCount: workoutCount, splitsCounter: splitsCounter },
    },
    loading: loading,
  };
};

export default useAnalysticsLogic;
