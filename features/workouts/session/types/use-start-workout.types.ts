import { FinishUserWorkoutBody } from '@strong-together/shared';
import type { Exercise, ExerciseInPlan, WorkoutSplit } from '../../shared/types/workout.types';

export type ResumeWorkoutCachePayload = {
  selectedSplit: WorkoutSplit;
  workout: ExercisesDuringWorkout;
  startTime: number;
  lastPause: number;
  pausedTotal: number;
};

export type ExercisesDuringWorkout = Record<
  Exercise['name'],
  {
    etsid: number;
    weight: number[];
    reps: number[];
    notes: string | null;
  }
>;

export interface StartWorkoutPageLogicReturn {
  data: {
    exercisesForSelectedSplit: ExerciseInPlan[];
    startTime: number;
    pausedTotal: number;
    totalSets: number;
    workoutName: string;
    setsDone: number;
    setsDoneWithExerciseNameKey: SetCountByExercise;
  };
  controls: {
    addNotes: (exerciseName: Exercise['name'], notes: string | null) => void;
    addRepsRecord: (exerciseName: Exercise['name'], setIndex: number, reps: number) => void;
    addWeightRecord: (exerciseName: Exercise['name'], setIndex: number, weight: number) => void;
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
export type ExerciseName = Exercise['name'];

