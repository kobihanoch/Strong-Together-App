import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getUserExerciseTracking } from "../services/WorkoutService";
import { unpackFromExerciseTrackingData } from "../utils/authUtils";
import { useAuth } from "./AuthContext";
import { useGlobalAppLoadingContext } from "./GlobalAppLoadingContext";
import {
  cacheGetJSON,
  cacheSetJSON,
  keyTracking,
  TTL_48H,
} from "../cache/cacheUtils";
import useUpdateCache from "../hooks/useUpdateCache";

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

  const { user, sessionLoading } = useAuth();

  // Raw and derived analysis state
  const [exerciseTrackingMaps, setExerciseTrackingMaps] = useState(null);

  const [analyzedExerciseTrackingData, setAnalyzedExerciseTrackingData] =
    useState(null);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);

  // Loading flag for this context
  const [loading, setLoading] = useState(true);

  // Stable cache key (unify 45 days usage)
  const trackingKey = useMemo(
    () => (user ? keyTracking(user.id, 45) : null),
    [user?.id]
  );

  useEffect(() => {
    console.log("Analysis Mounted");
    (async () => {
      if (user) {
        try {
          setLoading(true);
          // Check if cached
          const trackingKey = keyTracking(user.id, 45);
          const cached = await cacheGetJSON(trackingKey);
          if (cached) {
            console.log("Analysis is cached!");
            setExerciseTrackingMaps(cached.exerciseTrackingMaps ?? []);
            // If cached - already unpacked
            setAnalyzedExerciseTrackingData(
              cached.analyzedExerciseTrackingData
            );
            setHasTrainedToday(cached.hasTrainedToday);
            return;
          }

          // If not cached call API
          const res = await getUserExerciseTracking();
          const { exerciseTrackingAnalysis, exerciseTrackingMaps } = res;

          setExerciseTrackingMaps(exerciseTrackingMaps ?? []);
          // If raw data from server - unpack
          setAnalyzedExerciseTrackingData(
            unpackFromExerciseTrackingData(exerciseTrackingAnalysis)
          );
          setHasTrainedToday(exerciseTrackingAnalysis.hasTrainedToday);

          // Store in cache (auto)
        } finally {
          setLoading(false);
        }
      }
    })();

    return logoutCleanup;
  }, [user]);

  useEffect(() => {
    setGlobalLoading("analysis", loading);
    return () => setGlobalLoading("analysis", false);
  }, [loading, setGlobalLoading]);

  const logoutCleanup = useCallback(() => {
    setAnalyzedExerciseTrackingData(null);
    setHasTrainedToday(false);
    setLoading(false);
    console.log("Analysis Unmounted");
  }, []);

  // Already unpacked (the analysis) - ready for later user
  const cachedPayload = useMemo(() => {
    return {
      exerciseTrackingMaps: exerciseTrackingMaps,
      analyzedExerciseTrackingData: analyzedExerciseTrackingData,
      hasTrainedToday: hasTrainedToday,
    };
  }, [exerciseTrackingMaps, analyzedExerciseTrackingData, hasTrainedToday]);

  const enabled = !!user?.id && !loading;
  useUpdateCache(trackingKey, cachedPayload, TTL_48H, enabled);

  // Memoized context value
  const value = useMemo(
    () => ({
      exerciseTrackingMaps,
      setExerciseTrackingMaps,
      analyzedExerciseTrackingData,
      setAnalyzedExerciseTrackingData,
      hasTrainedToday,
      setHasTrainedToday,
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
