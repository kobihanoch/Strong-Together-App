// Returns an obj
// {
//  workoutSplits = [{name: A, id: 1, muscle_group:...}, {name: B, id: 2. muscle_group:...},....]
//  exercises = {A: [exercises...], B: [exercises...]}
// }
export const extractWorkoutSplits = (workout) => {
  if (!workout || !workout?.workoutsplits)
    return { workoutSplits: [], exercises: [] };

  const map = workout.workoutsplits.reduce((acc, split) => {
    acc[split.name] = [...split.exercisetoworkoutsplit];
    return acc;
  }, {});

  const arr = workout.workoutsplits.reduce(
    (acc, split) => {
      acc.arr.push({
        name: split.name,
        id: split.id,
        muscleGroup: split.muscle_group,
      });
      return acc;
    },
    { arr: [] }
  );

  return { workoutSplits: arr.arr, exercises: map };
};
