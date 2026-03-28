import { WorkoutContextWorkoutSplit } from '../../context/types/workoutContextTypes.dto';
import { FinishUserWorkoutBody } from '../../types/api/workouts/requests';
import { ExerciseInPlan } from '../../types/dto/workoutPlans.dto';
import { ExerciseEntity } from '../../types/entities/exercise.entity';
import { ExerciseToWorkoutSplitEntity } from '../../types/entities/exerciseToWorkoutSplit.entity';
import { ExerciseTrackingEntity } from '../../types/entities/exerciseTracking.entity';
import { WorkoutPlanEntity } from '../../types/entities/workoutPlan.entity';

export type ResumeWorkoutCachePayload = {
  selectedSplit: WorkoutContextWorkoutSplit;
  workout: ExercisesDuringWorkout;
  startTime: number;
  lastPause: number;
  pausedTotal: number;
};

export type ExercisesDuringWorkout = Record<
  ExerciseEntity['name'],
  {
    etsid: ExerciseToWorkoutSplitEntity['id'];
    weight: ExerciseTrackingEntity['weight'];
    reps: ExerciseTrackingEntity['reps'];
    notes: ExerciseTrackingEntity['notes'];
  }
>;

export interface StartWorkoutPageLogicReturn {
  data: {
    exercisesForSelectedSplit: ExerciseInPlan[];
    startTime: number;
    pausedTotal: number;
    totalSets: number;
    workoutName: WorkoutPlanEntity['name'];
    setsDone: number;
    setsDoneWithExerciseNameKey: SetCountByExercise;
  };
  controls: {
    addNotes: (exerciseName: ExerciseEntity['name'], notes: ExerciseTrackingEntity['notes']) => void;
    addRepsRecord: (exerciseName: ExerciseEntity['name'], setIndex: number, reps: number) => void;
    addWeightRecord: (exerciseName: ExerciseEntity['name'], setIndex: number, weight: number) => void;
  };
  saving: {
    saveStarted: boolean;
    saveData: () => Promise<void>;
  };
  onExit: () => Promise<void>;
  workoutProgressObj: ExercisesDuringWorkout;
}

export type SetCountByExercise = Record<ExerciseName, { done: number; planned: number }>;
export type WorkoutPayloadRow = FinishUserWorkoutBody['workout'][number];
export type ExerciseName = ExerciseEntity['name'];
export type SetValue = ExerciseTrackingEntity['weight'][number];
