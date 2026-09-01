import { GetWorkoutHistoryResponse } from '@strong-together/shared';

export type WorkoutHistoryMap = GetWorkoutHistoryResponse;
export type WorkoutHistoryItem = WorkoutHistoryMap['byDate'][string];
export type ExerciseInWorkoutHistory = WorkoutHistoryMap['byDate'][string]['exerciseTracked'][number]['exerciseTracking'];
