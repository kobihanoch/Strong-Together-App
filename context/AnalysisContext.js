import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { getUserExerciseTracking } from "../services/WorkoutService";
import { unpackFromExerciseTrackingData } from "../utils/authUtils";
import { useGlobalAppLoadingContext } from "./GlobalAppLoadingContext";
import { getExerciseTrackingMapped } from "../utils/statisticsUtils";

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

  useEffect(() => {
    console.log("Analysis Mounted");
    (async () => {
      if (user) {
        try {
          setLoading(true);
          const { exerciseTrackingAnalysis, exerciseTrackingMaps } =
            await getUserExerciseTracking();

          setExerciseTrackingMaps(exerciseTrackingMaps ?? []);
          setAnalyzedExerciseTrackingData(
            unpackFromExerciseTrackingData(exerciseTrackingAnalysis)
          );
          setHasTrainedToday(!!res?.hasTrainedToday);
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

  // Memoized context value
  const value = useMemo(
    () => ({
      exerciseTrackingMaps,
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
