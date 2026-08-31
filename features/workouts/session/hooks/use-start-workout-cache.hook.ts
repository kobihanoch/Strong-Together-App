import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { keyStartWorkout } from '../../../../infrastructure/cache/cache-keys.utils';
import { cacheSetJSON } from '../../../../infrastructure/cache/cache.constants';
import { AppUser } from '../../../auth/shared/types/auth.types';
import { WorkoutSplit } from '../../shared/types/workout.types';
import { ExercisesDuringWorkout, ResumeWorkoutCachePayload } from '../types/use-start-workout.types';

// Encapsulates: startTime, pausedTotal, and debounced cache writes (kept exactly as-is)
export const useStartWorkoutCache = (
  userId: AppUser['id'],
  selectedSplit: WorkoutSplit,
  resumedWorkout: Omit<ResumeWorkoutCachePayload, 'selectedSplit'> | undefined,
  workoutProgressObj: ExercisesDuringWorkout,
) => {
  // Cache key per user
  const cacheKey = keyStartWorkout(userId);

  // Start time calculated once at mounting, clears on unmounting
  // UNCOMMENT TO ENABLE TIME PAUSE DURING BREAKOFFS
  const [pausedTotal /*setPausedTotal*/] = useState<number>(/*resumedWorkout ? resumedWorkout.pausedTotal : */ 0);
  const startTime = useMemo(() => (resumedWorkout ? resumedWorkout.startTime : Date.now()), [resumedWorkout]);

  // UNCOMMENT TO ENABLE TIME PAUSE DURING BREAKOFFS
  // Total pause time
  /*useEffect(() => {
    const lp = resumedWorkout?.lastPause;
    if (typeof lp === "number" && Number.isFinite(lp)) {
      const delta = Math.max(0, Date.now() - lp); // clamp against negatives
      setPausedTotal((prev) => prev + delta);
    }
    // run once on mount; do not re-run on prop identity changes
  }, []);*/

  // Debounced caching (kept exactly with the commented call)
  const saveToCache = useCallback(async () => {
    if (disabledRef.current) return;
    await cacheSetJSON<ResumeWorkoutCachePayload>(cacheKey, {
      selectedSplit,
      workout: workoutProgressObj,
      startTime,
      lastPause: Date.now(),
      pausedTotal,
    });
  }, [cacheKey, selectedSplit, workoutProgressObj, startTime, pausedTotal]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce caching each workout progress change - REGULAR SAVE FOR NOW
  useEffect(() => {
    (async () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        saveToCache();
      }, 0);
    })();

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [workoutProgressObj, pausedTotal, saveToCache]);

  // App state listener
  const disabledRef = useRef(false);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'inactive' || state === 'background') {
        // Flush immediately
        saveToCache();
      }
    });
    return () => sub.remove();
  }, [saveToCache]);

  const disableCache = () => (disabledRef.current = true);

  return {
    cacheKey,
    startTime,
    pausedTotal,
    disableCache,
  };
};
