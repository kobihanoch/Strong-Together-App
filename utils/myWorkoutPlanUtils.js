// Gets exercise count for split
export const countExercisesForSplit = (allExercises, splitId) => {
  return allExercises.filter((exercise) => exercise.workoutsplit_id === splitId)
    .length;
};

// Count each split performed
export const getWorkoutSplitCounter = (splitName, exerciseLogs) => {
  if (!exerciseLogs) return 0;
  let etLogsUnique = new Set();
  let etLogsFilteredBySplitName = exerciseLogs.filter(
    (el) => el.splitname === splitName
  );
  etLogsFilteredBySplitName.forEach((el) => etLogsUnique.add(el.workoutdate));
  return etLogsUnique.size;
};
