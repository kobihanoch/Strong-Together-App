import { useState, useEffect, useMemo } from "react";
import { useGlobalAppLoadingContext } from "../../context/GlobalAppLoadingContext";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { getTrackingAnalytics } from "../../services/AnalyticsService";

const useAnalysticsLogic = () => {
  const { isLoading: globalLoading } = useGlobalAppLoadingContext();
  const { analyzedExerciseTrackingData } = useAnalysisContext();
  const { workoutCount = 0, splitDaysByName: splitsCounter = new Map() } =
    analyzedExerciseTrackingData ?? {};
  const { workout } = useWorkoutContext();
  const [_1RM, set1RM] = useState({});
  const [adherence, setAdherence] = useState({});
  const [loading, setLoading] = useState(true);
  const hasData = useMemo(
    () => !!analyzedExerciseTrackingData,
    [analyzedExerciseTrackingData]
  );

  // Fetch analytics data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { _1RM, goals } = await getTrackingAnalytics();
        set1RM(_1RM);
        setAdherence(goals);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    data: {
      overview: {
        workoutCount: workoutCount,
        splitsCounter: splitsCounter,
        workoutPlan: workout,
      },
      _1rms: {
        rm: _1RM,
      },
      adherence: {
        adh: adherence,
      },
    },
    loading: loading,
    globalLoading: globalLoading,
    hasData,
  };
};

export default useAnalysticsLogic;
