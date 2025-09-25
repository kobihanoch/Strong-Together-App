import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { keyTracking } from "../cache/cacheUtils";
import useCacheAndFetch from "../hooks/useCacheAndFetch";
import useUpdateGlobalLoading from "../hooks/useUpdateGlobalLoading";
import { getUserExerciseTracking } from "../services/WorkoutService";
import {
  checkHasTrainedToday,
  unpackFromExerciseTrackingData,
} from "../utils/analysisContexUtils";
import { useAuth } from "./AuthContext";
import { hasBootstrapPayload } from "../api/bootstrapApi";

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
  const { user, isValidatedWithServer } = useAuth();

  // Raw and derived analysis state
  const [exerciseTrackingMaps, setExerciseTrackingMaps] = useState(null);

  const [analyzedExerciseTrackingData, setAnalyzedExerciseTrackingData] =
    useState(null);

  const hasTrainedToday = useMemo(
    () => checkHasTrainedToday(analyzedExerciseTrackingData?.lastWorkoutDate),
    [analyzedExerciseTrackingData?.lastWorkoutDate]
  );

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await getUserExerciseTracking(), []);

  // On data function
  const onDataFn = useCallback((data) => {
    // Raw data from server - unpack
    // Data from cache - already unpacked
    setExerciseTrackingMaps(data?.exerciseTrackingMaps ?? []);
    // Determines if data retreived from API or cache
    try {
      setAnalyzedExerciseTrackingData(
        unpackFromExerciseTrackingData(data?.exerciseTrackingAnalysis)
      );
    } catch (error) {
      setAnalyzedExerciseTrackingData(data?.analyzedExerciseTrackingData);
    }
  }, []);

  // Cache payload
  const cachePayload = useMemo(
    () => ({
      exerciseTrackingMaps: exerciseTrackingMaps,
      analyzedExerciseTrackingData: analyzedExerciseTrackingData,
    }),
    [exerciseTrackingMaps, analyzedExerciseTrackingData]
  );

  // Hook usage
  const { loading, cacheKnown } = useCacheAndFetch(
    user, // user prop
    keyTracking, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    cachePayload, // cache payload
    "Analysis Context" // log
  );

  // Report analysis loading to global loading
  useUpdateGlobalLoading("Analysis", cacheKnown ? loading : true);

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
