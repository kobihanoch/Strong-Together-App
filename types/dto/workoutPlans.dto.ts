import { WorkoutPlanEntity } from '../entities/workoutPlan.entity.ts';
import { WorkoutSplitEntity } from '../entities/workoutSplit.entity.ts';
import { ExerciseEntity } from './../entities/exercise.entity';
import { ExerciseToWorkoutSplitEntity } from './../entities/exerciseToWorkoutSplit.entity';

export type ExerciseInPlan = Pick<ExerciseToWorkoutSplitEntity, 'id' | 'sets' | 'is_active'> &
  Pick<ExerciseEntity, 'targetmuscle' | 'specifictargetmuscle'> & {
    exercise: ExerciseEntity['name'] | null;
    workoutsplit: WorkoutSplitEntity['name'] | null;
  };

export interface WholeUserWorkoutPlan extends WorkoutPlanEntity {
  workoutsplits: Array<
    WorkoutSplitEntity & {
      exercisetoworkoutsplit: ExerciseInPlan[] | null;
    }
  > | null;
}

export interface AddWorkoutSplitPayload {
  [splitName: string]: Array<{
    id: number; // exercise_id
    sets: number | number[];
    order_index?: number | undefined;
  }>;
}
export type WorkoutSplitsMap = Record<
  NonNullable<WorkoutSplitEntity['name']>,
  Array<{
    id: ExerciseToWorkoutSplitEntity['id'];
    name: ExerciseEntity['name'];
    sets: ExerciseToWorkoutSplitEntity['sets'];
    order_index: ExerciseToWorkoutSplitEntity['order_index'];
    targetmuscle: ExerciseEntity['targetmuscle'];
    specifictargetmuscle: ExerciseEntity['specifictargetmuscle'];
  }>
>;
