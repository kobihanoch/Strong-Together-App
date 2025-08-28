import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { keyTracking, TTL_48H } from "../cache/cacheUtils";
import useGetCache from "../hooks/useGetCache";
import useUpdateCache from "../hooks/useUpdateCache";
import { getUserExerciseTracking } from "../services/WorkoutService";
import {
  checkHasTrainedToday,
  unpackFromExerciseTrackingData,
} from "../utils/analysisContexUtils";
import { useAuth } from "./AuthContext";
import { useGlobalAppLoadingContext } from "./GlobalAppLoadingContext";

const AnalysisContext = createContext(null);
export const useAnalysisContext = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error(
      "useAnalysisContext must be used within a AnalysisProvider"
    );
  }
  return ctx;
};

/**
 * Analysis Context
 * -----------------
 * Responsibilities:
 * - Fetch raw exerciseTracking data
 * - Derive analyzedExerciseTrackingData via `unpackFromExerciseTrackingData`
 * - Tell whether the user trained today (hasTrainedToday)
 * - Expose a loading flag
 * - Reset state when user logs out (user becomes null)
 */

export const AnalysisProvider = ({ children }) => {
  // Global loading
  const { setLoading: setGlobalLoading } = useGlobalAppLoadingContext();

  const { user } = useAuth();

  // Stable cache key (unify 45 days usage)
  const trackingKey = useMemo(
    () => (user ? keyTracking(user.id, 45) : null),
    [user?.id]
  );

  // Get cache
  const { cached, hydrated: cacheHydrated } = useGetCache(trackingKey);

  // Raw and derived analysis state
  const [exerciseTrackingMaps, setExerciseTrackingMaps] = useState(null);

  const [analyzedExerciseTrackingData, setAnalyzedExerciseTrackingData] =
    useState(null);

  const hasTrainedToday = useMemo(
    () => checkHasTrainedToday(analyzedExerciseTrackingData?.lastWorkoutDate),
    [analyzedExerciseTrackingData?.lastWorkoutDate]
  );

  // Loading flag for this context
  const [loading, setLoading] = useState(true);

  // Update cache on change of payload
  // Already unpacked (the analysis) - ready for later user
  const cachedPayload = useMemo(() => {
    return {
      exerciseTrackingMaps: exerciseTrackingMaps,
      analyzedExerciseTrackingData: analyzedExerciseTrackingData,
    };
  }, [exerciseTrackingMaps, analyzedExerciseTrackingData]);

  const enabled = !!user?.id && !loading;
  useUpdateCache(trackingKey, cachedPayload, TTL_48H, enabled);

  useEffect(() => {
    console.log("Analysis Mounted");
  }, []);

  // Load from cache and from server
  useEffect(() => {
    (async () => {
      if (cacheHydrated && user && trackingKey) {
        try {
          // Check if cached
          if (cached) {
            console.log("Analysis is cached!");
            setExerciseTrackingMaps(cached.exerciseTrackingMaps ?? []);
            // If cached - already unpacked
            setAnalyzedExerciseTrackingData(
              cached.analyzedExerciseTrackingData
            );
            setLoading(false);
          } else {
            setLoading(true);
          }

          // If not cached call API
          const res = await getUserExerciseTracking();
          const { exerciseTrackingAnalysis, exerciseTrackingMaps } = res;

          // If raw data from server - unpack
          const unpackedAnalysis = unpackFromExerciseTrackingData(
            exerciseTrackingAnalysis
          );

          // Comapre cache to raw unpacked from server - if same dont cause re render for states
          if (
            unpackedAnalysis.workoutCount ===
              cached?.analyzedExerciseTrackingData?.workoutCount &&
            unpackedAnalysis.lastWorkoutDate ===
              cached?.analyzedExerciseTrackingData?.lastWorkoutDate
          )
            return;

          setExerciseTrackingMaps(exerciseTrackingMaps ?? []);
          setAnalyzedExerciseTrackingData(unpackedAnalysis);

          // Store in cache (auto)
        } finally {
          setLoading(false);
        }
      }
    })();

    return logoutCleanup;
  }, [cacheHydrated, cached, user, trackingKey]);

  // Update global loading
  useEffect(() => {
    setGlobalLoading("analysis", loading);
    return () => setGlobalLoading("analysis", false);
  }, [loading, setGlobalLoading]);

  // Unmount cleanup
  const logoutCleanup = useCallback(() => {
    setAnalyzedExerciseTrackingData(null);
    setExerciseTrackingMaps(null);
    setLoading(false);
    console.log("Analysis Unmounted");
  }, []);

  // Memoized context value
  const value = useMemo(
    () => ({
      exerciseTrackingMaps,
      setExerciseTrackingMaps,
      analyzedExerciseTrackingData,
      setAnalyzedExerciseTrackingData,
      hasTrainedToday,
      loading,
    }),
    [
      exerciseTrackingMaps,
      analyzedExerciseTrackingData,
      hasTrainedToday,
      loading,
    ]
  );

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};
