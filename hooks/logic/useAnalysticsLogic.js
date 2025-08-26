import { useState, useEffect, useMemo } from "react";
import { useGlobalAppLoadingContext } from "../../context/GlobalAppLoadingContext";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { getTrackingAnalytics } from "../../services/AnalyticsService";
import { cacheGetJSON, keyAnalytics, TTL_48H } from "../../cache/cacheUtils";
import { useAuth } from "../../context/AuthContext";
import useUpdateCache from "../useUpdateCache";

const useAnalysticsLogic = () => {
  const { isLoading: globalLoading } = useGlobalAppLoadingContext();
  const { user } = useAuth();
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

  const analyticsKey = useMemo(
    () => (user ? keyAnalytics(user.id) : null),
    [user?.id]
  );

  // Fetch analytics data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Check cache
        const analyticsKey = keyAnalytics(user.id);
        const cached = await cacheGetJSON(analyticsKey);
        if (cached) {
          set1RM(cached._1RM);
          setAdherence(cached.goals);
          return;
        }

        // API
        const { _1RM, goals } = await getTrackingAnalytics();
        set1RM(_1RM);
        setAdherence(goals);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Cache payload
  const cachedPayload = useMemo(() => {
    return {
      _1RM: _1RM,
      goals: adherence,
    };
  }, [_1RM, adherence]);

  const enabled = !!user?.id && !loading;
  useUpdateCache(analyticsKey, cachedPayload, TTL_48H, enabled);

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
