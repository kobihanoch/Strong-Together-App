import { WorkoutPlanSplit } from '../../plan/types/workout-plan.types';
import { FinishUserWorkoutBody } from '@strong-together/shared';
import { ExerciseInPlan } from '@strong-together/shared';
import { ExerciseEntity } from '@strong-together/shared';
import { ExerciseToWorkoutSplitEntity } from '@strong-together/shared';
import { ExerciseTrackingEntity } from '@strong-together/shared';
import { WorkoutPlanEntity } from '@strong-together/shared';

export type ResumeWorkoutCachePayload = {
  selectedSplit: WorkoutPlanSplit;
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

