import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { getUserExerciseTracking } from "../services/WorkoutService";
import { unpackFromExerciseTrackingData } from "../utils/authUtils";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const { user } = useAuth();
  const [exerciseTracking, setExerciseTracking] = useState(null);
  const [analyzedExerciseTrackingData, setAnalyzedExerciseTrackingData] =
    useState(null);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const exerciseTrackingData = await getUserExerciseTracking();
      setExerciseTracking(exerciseTrackingData.exercisetracking);
      setAnalyzedExerciseTrackingData(
        unpackFromExerciseTrackingData(exerciseTrackingData)
      );
      setHasTrainedToday(exerciseTrackingData.hasTrainedToday);
      setLoading(false);
    })();
  }, [user]);

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

export const useAnalysisContext = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error(
      "useAnalysisContext must be used within a AnalysisProvider"
    );
  }
  return context;
};
