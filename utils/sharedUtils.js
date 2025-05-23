// Gets a full workout JSON and split it
export const splitTheWorkout = (userWorkout) => {
  if (userWorkout) {
    const workoutObj = Object.fromEntries(
      Object.entries(userWorkout).slice(0, 7)
    );
    //setWorkout(workoutObj);

    const fullWorkoutSplits = userWorkout.workoutsplits || [];
    const splits = fullWorkoutSplits
      .map((split) => Object.fromEntries(Object.entries(split).slice(0, 5)))
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

    //setWorkoutSplits(splits);

    const allExercises = fullWorkoutSplits.flatMap((split) =>
      (split.exercisetoworkoutsplit ?? []).map((item) => {
        const { exercises, ...itemWithoutExercises } = item;
        return {
          ...itemWithoutExercises,
          ...exercises,
        };
      })
    );
    //setExercises(allExercises);
    return {
      workout: workoutObj,
      workoutSplits: splits,
      exercises: allExercises,
    };
  } else {
    return {};
  }
};
