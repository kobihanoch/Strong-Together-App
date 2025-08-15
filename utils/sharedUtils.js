// Returns an obj
// {workoutSplits = [A,B,C,...], exercises = {A: [exercises...], B: [exercises...]}}
export const extractWorkoutSplits = (workout) => {
  if (!workout) return null;
  const map = workout.workoutsplits.reduce((acc, split) => {
    acc[split.name] = [...split.exercisetoworkoutsplit];
    return acc;
  }, {});
  return { workoutSplits: Object.keys(map), exercises: map };
};
