import { WorkoutSplitEntity } from '../../types/entities/workoutSplit.entity';

export type ExerciseCounter = Record<NonNullable<WorkoutSplitEntity['name']>, number>;
