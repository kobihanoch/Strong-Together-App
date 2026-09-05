import type { CreateWorkoutSessionBody } from '@strong-together/shared';

/** Keeps only completed sets and normalizes values before server submission. */
export const normalizeWorkoutForSubmission = (
  draft: CreateWorkoutSessionBody,
  completedSetKeys: string[],
): CreateWorkoutSessionBody => ({
  ...draft,
  workout: draft.workout
    .map((exercise, exerciseIndex) => {
      const exerciseKey = String(exercise.exerciseToSplitId ?? `added-${exercise.exerciseId ?? exerciseIndex}`);
      return {
        ...exercise,
        notes: exercise.notes?.trim() || null,
        trackedSets: exercise.trackedSets
          .filter((set) => completedSetKeys.includes(`${exerciseKey}:${set.setIndex}`))
          .map((set) => ({ ...set, weight: Number(set.weight), reps: Number(set.reps) }))
          .filter((set) => Number.isFinite(set.weight) && set.weight > 0 && Number.isInteger(set.reps) && set.reps > 0),
      };
    })
    .filter((exercise) => exercise.trackedSets.length > 0),
});
