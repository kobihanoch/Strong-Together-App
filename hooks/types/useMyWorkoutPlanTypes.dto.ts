import { WorkoutSplitEntity } from '../../types/entities/workoutSplit.entity';

export type ExerciseCounter = Record<WorkoutSplitEntity['name'], number>;
