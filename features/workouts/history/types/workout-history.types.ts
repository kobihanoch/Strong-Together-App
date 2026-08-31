import { GetExerciseTrackingResponse } from '@strong-together/shared';

export type WorkoutHistoryExerciseTrackingMaps = GetExerciseTrackingResponse;
export type TrackingMapItem = WorkoutHistoryExerciseTrackingMaps['byExerciseToSplitId'][string][number];
