import { GetExerciseTrackingResponse } from '@strong-together/shared';

export type WorkoutHistoryExerciseTrackingMaps = GetExerciseTrackingResponse;

export interface WorkoutHistoryProviderValue {
  exerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps | null;
  setExerciseTrackingMaps: React.Dispatch<React.SetStateAction<WorkoutHistoryExerciseTrackingMaps | undefined>>;
  hasTrainedToday: boolean;
  loading: boolean;
}
