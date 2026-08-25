import { WorkoutHistoryExerciseTrackingMaps } from '../../../history/types/workout-history.types';

export interface WorkoutHistoryProviderValue {
  exerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps | null;
  setExerciseTrackingMaps: React.Dispatch<React.SetStateAction<WorkoutHistoryExerciseTrackingMaps | undefined>>;
  hasTrainedToday: boolean;
  loading: boolean;
}
