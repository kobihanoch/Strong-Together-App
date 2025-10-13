import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cacheSetJSON, keyStartWorkout, TTL_36H } from "../cache/cacheUtils";
import { AppState } from "react-native";

// Encapsulates: startTime, pausedTotal, and debounced cache writes (kept exactly as-is)
export const useStartWorkoutCache = (
  userId,
  selectedSplit,
  resumedWorkout,
  workoutProgressObj
) => {
  // Cache key per user
  const cacheKey = keyStartWorkout(userId);

  // Start time calculated once at mounting, clears on unmounting
  const [pausedTotal, setPausedTotal] = useState(
    resumedWorkout ? resumedWorkout.pausedTotal : 0
  );
  const startTime = useMemo(
    () => (resumedWorkout ? resumedWorkout.startTime : Date.now()),
    [resumedWorkout]
  );

  // Total pause time
  useEffect(() => {
    const lp = resumedWorkout?.lastPause;
    if (typeof lp === "number" && Number.isFinite(lp)) {
      const delta = Math.max(0, Date.now() - lp); // clamp against negatives
      setPausedTotal((prev) => prev + delta);
    }
    // run once on mount; do not re-run on prop identity changes
  }, []);

  // Debounced caching (kept exactly with the commented call)
  const saveToCache = useCallback(async () => {
    await cacheSetJSON(
      cacheKey,
      {
        selectedSplit,
        workout: workoutProgressObj,
        startTime,
        lastPause: Date.now(),
        pausedTotal,
      },
      TTL_36H
    );
  }, [cacheKey, selectedSplit, workoutProgressObj, startTime, pausedTotal]);

  const timeoutRef = useRef(null);

  // Debounce caching each workout progress change - REGULAR SAVE FOR NOW
  useEffect(() => {
    (async () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        saveToCache();
      }, 0);
    })();

    return () => clearTimeout(timeoutRef.current);
  }, [workoutProgressObj, pausedTotal, saveToCache]);

  // App state listener
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "inactive" || state === "background") {
        // Flush immediately
        saveToCache();
      }
    });
    return () => sub.remove();
  }, [saveToCache]);

  return {
    cacheKey,
    startTime,
    pausedTotal,
  };
};
