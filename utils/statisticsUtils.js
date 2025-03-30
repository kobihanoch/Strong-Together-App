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
