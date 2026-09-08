import { GetExerciseHistoryResponse } from '@strong-together/shared';

export type ExerciseHistoryMap = GetExerciseHistoryResponse;
export type ExerciseHistoryItem = ExerciseHistoryMap['byExerciseToSplitId'][string];
export type ExerciseInExerciseHistory = ExerciseHistoryItem['exerciseTracked'][number];
