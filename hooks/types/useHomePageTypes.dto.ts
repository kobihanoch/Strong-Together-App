import { AnalysisContextAnalyzedExerciseTrackingData } from '../../context/types/analysisContextTypes.dto';
import { AppUser } from './../../context/types/authContextTypes.dto';

export type HomePageData = {
  username: AppUser['username'];
  userId: AppUser['id'];
  hasAssignedWorkout: boolean;
  hasTracking: boolean;
  profileImageUrl: AppUser['profile_image_url'];
  firstName: AppUser['name'];
  lastWorkoutDate: AnalysisContextAnalyzedExerciseTrackingData['lastWorkoutDate'];
  totalWorkoutNumber: AnalysisContextAnalyzedExerciseTrackingData['workoutCount'];
  workoutSplitsNumber: number;
  mostFrequentSplit: AnalysisContextAnalyzedExerciseTrackingData['mostFrequentSplit'] | null;
  PR: AnalysisContextAnalyzedExerciseTrackingData['pr'] | null;
  isLoading: boolean;
};
