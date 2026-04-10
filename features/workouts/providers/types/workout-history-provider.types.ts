import {
  WorkoutHistoryAnalyzedExerciseTrackingData,
  WorkoutHistoryExerciseTrackingMaps,
} from '../../history/types/workout-history.types';

export type WorkoutHistoryProviderCachePayload = {
  exerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps | null;
  exerciseTrackingAnalysisUnpacked: WorkoutHistoryAnalyzedExerciseTrackingData | null;
};

export interface WorkoutHistoryProviderValue {
  exerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps | null;
  setExerciseTrackingMaps: React.Dispatch<React.SetStateAction<WorkoutHistoryExerciseTrackingMaps | null>>;
  analyzedExerciseTrackingData: WorkoutHistoryAnalyzedExerciseTrackingData | null;
  setAnalyzedExerciseTrackingData: React.Dispatch<React.SetStateAction<WorkoutHistoryAnalyzedExerciseTrackingData | null>>;
  hasTrainedToday: boolean;
  loading: boolean;
}
