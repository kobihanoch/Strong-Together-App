import { useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { useAnalysisContext } from "../../context/AnalysisContext";

const useHomePageLogic = () => {
  // Auth state (user + global session loading)
  const { user, sessionLoading } = useAuth();

  // Workout state (plan + derived maps + loading)
  const {
    workout,
    workoutSplits, // [A,B,C...]
    loading: workoutLoading,
  } = useWorkoutContext();

  // Analysis state (tracking + derived analytics + loading)
  const {
    exerciseTracking,
    analyzedExerciseTrackingData,
    loading: analysisLoading,
  } = useAnalysisContext();

  // Derive stable user fields
  const { username, userId, firstName, profileImageUrl } = useMemo(() => {
    const u = user ?? {};
    // Safe split for first name
    const fName =
      typeof u.name === "string" && u.name.trim().length
        ? u.name.trim().split(" ")[0]
        : "";
    return {
      username: u.username ?? "",
      userId: u.id ?? "",
      firstName: fName,
      profileImageUrl: u.profile_image_url ?? "",
    };
  }, [user]);

  // Derived workout flags/counters
  const { hasAssignedWorkout, workoutSplitsNumber } = useMemo(() => {
    const hasWorkout = !!workout;
    // workoutSplits is a map in the new context; count keys safely
    const splitsCount = workoutSplits ? Object.keys(workoutSplits).length : 0;
    return { hasAssignedWorkout: hasWorkout, workoutSplitsNumber: splitsCount };
  }, [workout, workoutSplits]);

  // Derived analysis fields
  const { PR, totalWorkoutNumber, mostFrequentSplit, lastWorkoutDate } =
    useMemo(() => {
      const a = analyzedExerciseTrackingData ?? {};
      return {
        PR: a.pr ?? null,
        totalWorkoutNumber: a.workoutCount ?? 0,
        mostFrequentSplit: a.mostFrequentSplit ?? null,
        lastWorkoutDate: a.lastWorkoutDate ?? "none",
      };
    }, [analyzedExerciseTrackingData]);

  // Unified loading for the Home screen
  const loading = useMemo(() => {
    // Show loading while any provider is still loading or
    // (optionally) while user exists but analysis is not yet ready.
    const baseLoading = sessionLoading || workoutLoading || analysisLoading;
    return baseLoading;
  }, [sessionLoading, workoutLoading, analysisLoading]);

  // Stable data object for easy consumption in components
  const data = useMemo(
    () => ({
      username,
      userId,
      hasAssignedWorkout,
      profileImageUrl,
      firstName,
      lastWorkoutDate,
      totalWorkoutNumber,
      workoutSplitsNumber,
      mostFrequentSplit,
      PR,
      exerciseTracking: exerciseTracking ?? null,
    }),
    [
      username,
      userId,
      hasAssignedWorkout,
      profileImageUrl,
      firstName,
      lastWorkoutDate,
      totalWorkoutNumber,
      workoutSplitsNumber,
      mostFrequentSplit,
      PR,
      exerciseTracking,
    ]
  );

  return {
    data,
    loading,
  };
};

export default useHomePageLogic;
