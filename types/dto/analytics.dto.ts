import { ExerciseEntity } from '../entities/exercise.entity.ts';
import { WorkoutSplitEntity } from '../entities/workoutSplit.entity.ts';

export interface WorkoutRMRecord {
  exercise: ExerciseEntity['name'];
  pr_weight: number | null;
  pr_reps: number | null;
  max_1rm: number;
}

export type WorkoutRMsResponse = Record<ExerciseEntity['id'], WorkoutRMRecord>; // Key is exercise_id

export interface AdherenceExerciseStats {
  planned: number;
  actual: number;
  adherence_pct: number | null;
}

export type GoalAdherenceResponse = Record<
  WorkoutSplitEntity['name'], // splitname
  Record<string, AdherenceExerciseStats> // exercise name -> stats
>;
