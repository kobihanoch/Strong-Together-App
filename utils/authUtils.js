export const filterMessagesByUnread = (messagesArr) => {
  return messagesArr.filter((msg) => msg.is_read === false);
};

export const unpackFromExerciseTrackingData = (exerciseTrackingData) => {
  return {
    pr: {
      maxReps: exerciseTrackingData.pr_max.reps,
      maxWeight: exerciseTrackingData.pr_max.weight,
      maxExercise: exerciseTrackingData.pr_max.exercise,
      maxDate: exerciseTrackingData.pr_max.workoutDate,
    },
    workoutCount: exerciseTrackingData.unique_days,
    mostFrequentSplit: {
      splitName: exerciseTrackingData.most_frequent_split,
      times: exerciseTrackingData.most_frequent_split_days,
      id: exerciseTrackingData.most_frequent_split_id,
    },
    lastWorkoutDate: exerciseTrackingData.lastWorkoutDate,
    splitDaysByName: exerciseTrackingData.splitDaysByName,
  };
};
