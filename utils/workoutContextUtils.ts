import { ExerciseInPlan, WholeUserWorkoutPlan } from '@strong-together/shared';
import { WorkoutSplitEntity } from '@strong-together/shared';

type SplitName = WorkoutSplitEntity['name'];
type SplitId = WorkoutSplitEntity['id'];
type MuscleGroup = WorkoutSplitEntity['muscle_group'];

// Returns an obj
// {
//  workoutSplits = [{name: A, id: 1, muscle_group:...}, {name: B, id: 2. muscle_group:...},....]
//  exercises = {A: [exercises...], B: [exercises...]}
// }
type ExtractWorkoutSplitsReturnType = {
  workoutSplits: {
    name: SplitName;
    id: SplitId;
    muscleGroup: MuscleGroup;
  }[];
  exercises: Record<SplitName, ExerciseInPlan[]>;
};

export const extractWorkoutSplits = (workout: WholeUserWorkoutPlan | null): ExtractWorkoutSplitsReturnType => {
  if (!workout || !workout?.workoutsplits)
    return { workoutSplits: [], exercises: {} as Record<SplitName, ExerciseInPlan[]> };

  const map = workout.workoutsplits.reduce((acc: Record<SplitName, ExerciseInPlan[]>, split) => {
    const splitName = split.name;
    const splitExFields = split.exercisetoworkoutsplit || [];
    acc[splitName!] = [...splitExFields];
    return acc;
  }, {});

  const arr = workout.workoutsplits.reduce(
    (acc: { arr: { name: SplitName; id: SplitId; muscleGroup: MuscleGroup }[] }, split) => {
      acc.arr.push({
        name: split.name!,
        id: split.id,
        muscleGroup: split.muscle_group!,
      });
      return acc;
    },
    { arr: [] },
  );

  return { workoutSplits: arr.arr, exercises: map };
};
