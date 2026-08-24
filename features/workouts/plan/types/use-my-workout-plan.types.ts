import type { WorkoutSplit } from '../../shared/types/workout.types';

export type ExerciseCounter = Record<WorkoutSplit['name'], number>;
