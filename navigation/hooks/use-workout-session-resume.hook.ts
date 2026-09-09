import { useEffect, useState } from 'react';
import { useWorkoutSessionStore } from '../../features/workouts/session/hooks/use-workout-session-store.hook';

/**
 * Restores the persisted workout context before AppStack chooses its initial route.
 * It also recovers split metadata from the workout-plan cache for older drafts.
 */
const useWorkoutSessionResume = () => {
  const draft = useWorkoutSessionStore((state) => state.draft);
  const restoredWorkoutSplit = useWorkoutSessionStore((state) => state.workoutSplit);
  const [hasHydrated, setHasHydrated] = useState(useWorkoutSessionStore.persist.hasHydrated());

  useEffect(() => {
    const unsubHydrate = useWorkoutSessionStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    return () => {
      unsubHydrate();
    };
  }, []);

  const shouldResume = Boolean(draft && restoredWorkoutSplit);

  useEffect(() => {
    if (!hasHydrated) return;

    if (shouldResume) {
      console.log(`\x1b[96m[Zustand Store]: Workout session restored: ${restoredWorkoutSplit?.name}.\x1b[0m`);
    } else {
      console.log(`\x1b[32m[Zustand Store]: No workout session to restore.\x1b[0m`);
    }
  }, [hasHydrated, shouldResume, restoredWorkoutSplit?.name]);

  return {
    isHydrating: !hasHydrated,
    resume: hasHydrated ? shouldResume : false,
    restoredWorkoutSplit,
  };
};

export default useWorkoutSessionResume;
