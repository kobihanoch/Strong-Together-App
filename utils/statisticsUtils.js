export const filterExercisesByDate = (exerciseTracking, selectedDate) => {
  if (exerciseTracking) {
    const arr = [];
    exerciseTracking.forEach((et) => {
      if (et.workoutdate == selectedDate) {
        arr.push(et);
      }
    });
    return arr;
  }
};

export const getLastWorkoutForEachExercise = (
  exerciseTracking,
  exerciseTrackingByDate
) => {
  if (exerciseTracking?.length > 0 && exerciseTrackingByDate?.length > 0) {
    const sortedEtArr = [...exerciseTracking].sort(
      (a, b) => new Date(b.workoutdate) - new Date(a.workoutdate)
    );

    const currentDate = exerciseTrackingByDate[0].workoutdate;
    const lastWorkoutDates = {}; // { exercise_id: lastWorkoutDate }
    const previousWorkout = [];

    for (const ex of sortedEtArr) {
      if (
        !lastWorkoutDates[ex.exercise_id] &&
        new Date(ex.workoutdate) < new Date(currentDate)
      ) {
        lastWorkoutDates[ex.exercise_id] = ex.workoutdate;
      }
    }

    exerciseTrackingByDate.forEach((exercise) => {
      const lastDate = lastWorkoutDates[exercise.exercise_id];
      if (lastDate) {
        const prev = sortedEtArr.find(
          (et) =>
            et.exercise_id === exercise.exercise_id &&
            et.workoutdate === lastDate
        );

        if (prev) {
          previousWorkout.push({
            ...prev,
            isLastWorkout: !sortedEtArr.some(
              (et) =>
                et.exercise_id === exercise.exercise_id &&
                new Date(et.workoutdate) > new Date(prev.workoutdate) &&
                new Date(et.workoutdate) < new Date(currentDate)
            ),
          });
        }
      }
    });

    console.log(
      "Found previous workout:",
      JSON.stringify(previousWorkout, null, 2)
    );

    return previousWorkout;
  }

  return [];
};

export const getLastWorkoutWithSameType = (
  exerciseTracking,
  exerciseTrackingByDate
) => {
  if (exerciseTracking?.length > 0 && exerciseTrackingByDate?.length > 0) {
    const sortedEtArr = [...exerciseTracking].sort(
      (a, b) => new Date(a.workoutdate) - new Date(b.workoutdate)
    );

    let previousWorkout = [];
    const currentSplit = exerciseTrackingByDate[0].splitname;
    const currentDate = exerciseTrackingByDate[0].workoutdate;
    console.log("Current split: " + JSON.stringify(currentSplit));

    while (sortedEtArr.length > 0) {
      const last = sortedEtArr.pop();

      if (last.splitname === currentSplit && last.workoutdate !== currentDate) {
        previousWorkout.push(last);
        break;
      }
    }

    if (previousWorkout) {
      console.log(
        "Found previous workout:",
        JSON.stringify(previousWorkout, null, 2)
      );

      return previousWorkout;
    }
    return [];
  }
};
