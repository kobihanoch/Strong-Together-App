import { GetExerciseTrackingResponse } from '@strong-together/shared';
import {
  WorkoutHistoryAnalyzedExerciseTrackingData,
  WorkoutHistoryExerciseTrackingMaps,
} from '../../../history/types/workout-history.types';

export interface WorkoutHistoryProviderValue {
  exerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps | null;
  setExerciseTrackingMaps: React.Dispatch<React.SetStateAction<WorkoutHistoryExerciseTrackingMaps | undefined>>;
  analyzedExerciseTrackingData: WorkoutHistoryAnalyzedExerciseTrackingData | null;
  setExerciseTrackingAnalysis: React.Dispatch<React.SetStateAction<GetExerciseTrackingResponse['exerciseTrackingAnalysis'] | undefined>>;
  hasTrainedToday: boolean;
  loading: boolean;
}
