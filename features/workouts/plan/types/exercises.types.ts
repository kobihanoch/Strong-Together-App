import { ListExercisesResponse } from '@strong-together/shared';

export type ExercisesByMuscle = ListExercisesResponse;
type ExerciseLibraryItem = ExercisesByMuscle[string][number];
export type Exercise = ExerciseLibraryItem & { targetMuscle: string };
