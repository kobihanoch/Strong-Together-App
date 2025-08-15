import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { getUserExerciseTracking } from "../services/WorkoutService";
import { unpackFromExerciseTrackingData } from "../utils/authUtils";

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
  const { user, sessionLoading } = useAuth();

  // Raw and derived analysis state
  const [exerciseTracking, setExerciseTracking] = useState(null);
  const [analyzedExerciseTrackingData, setAnalyzedExerciseTrackingData] =
    useState(null);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);

  // Loading flag for this context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) {
      setLoading(true);
      return;
    }
    (async () => {
      // On logout, clear and stop
      if (!user?.id) {
        setExerciseTracking(null);
        setAnalyzedExerciseTrackingData(null);
        setHasTrainedToday(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await getUserExerciseTracking();
        setExerciseTracking(res?.exercisetracking ?? []);
        setAnalyzedExerciseTrackingData(unpackFromExerciseTrackingData(res));
        setHasTrainedToday(!!res?.hasTrainedToday);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

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
