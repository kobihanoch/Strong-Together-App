export const filterExercises = (allExercises, selectedSplit) => {
  return selectedSplit
    ? allExercises.filter(
        (exercise) => exercise.workoutsplit_id === selectedSplit.id
      )
    : [];
};

export const countExercisesForSplit = (allExercises, splitId) => {
  return allExercises.filter((exercise) => exercise.workoutsplit_id === splitId)
    .length;
};
