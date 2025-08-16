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
  const [exerciseTracking, setExerciseTracking] = useState(null);
  const [analyzedExerciseTrackingData, setAnalyzedExerciseTrackingData] =
    useState(null);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);

  // Loading flag for this context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (user) {
        try {
          setLoading(true);
          const res = await getUserExerciseTracking();
          setExerciseTracking(res?.exercisetracking ?? []);
          setAnalyzedExerciseTrackingData(unpackFromExerciseTrackingData(res));
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
    setExerciseTracking(null);
    setAnalyzedExerciseTrackingData(null);
    setHasTrainedToday(false);
    setLoading(false);
  }, []);

  // Memoized context value
  const value = useMemo(
    () => ({
      exerciseTracking,
      setExerciseTracking,
      analyzedExerciseTrackingData,
      setAnalyzedExerciseTrackingData,
      hasTrainedToday,
      setHasTrainedToday,
      loading,
    }),
    [exerciseTracking, analyzedExerciseTrackingData, hasTrainedToday, loading]
  );

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};
