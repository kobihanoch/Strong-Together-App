import { useCallback, useMemo, useState } from "react";
import { keyAnalytics } from "../../cache/cacheUtils";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useAuth } from "../../context/AuthContext";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { getTrackingAnalytics } from "../../services/AnalyticsService";
import useCacheAndFetch from "../useCacheAndFetch";

const useAnalysticsLogic = () => {
  const { user, isValidatedWithServer } = useAuth();
  const { analyzedExerciseTrackingData } = useAnalysisContext();
  const { workoutCount = 0, splitDaysByName: splitsCounter = new Map() } =
    analyzedExerciseTrackingData ?? {};
  const { workout } = useWorkoutContext();
  const [_1RM, set1RM] = useState({});
  const [adherence, setAdherence] = useState({});
  const hasData = useMemo(
    () => !!analyzedExerciseTrackingData,
    [analyzedExerciseTrackingData]
  );

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getTrackingAnalytics(), []);

  // On data function
  const onDataFn = useCallback((data) => {
    set1RM(data._1RM);
    setAdherence(data.goals);
  }, []);

  // Cache payload
  const cachePayload = useMemo(
    () => ({ _1RM: _1RM, goals: adherence }),
    [_1RM, adherence]
  );

  const validateFlag = useMemo(() => {
    return isValidatedWithServer && hasData;
  }, [isValidatedWithServer, hasData]);

  // Hook usage
  const { loading } = useCacheAndFetch(
    user, // user prop
    keyAnalytics, // key builder
    validateFlag, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    "Analytics" // log
  );

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
    hasData,
  };
};

export default useAnalysticsLogic;
