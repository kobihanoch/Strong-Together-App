export const formatDate = (dateToFormat) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateObj = new Date(dateToFormat);
  const monthName = monthNames[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${monthName} ${day}, ${year}`;
};

const isExerciseInLastWorkoutWithSameType = (exerciseId, lastWorkout) => {
  return lastWorkout.some((ex) => ex.exercise_id === exerciseId);
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
    const lastWorkoutWithSameType = getLastWorkoutWithSameType(
      exerciseTracking,
      exerciseTrackingByDate
    );

    const previousWorkout = [];

    exerciseTrackingByDate.forEach((exercise) => {
      const lastLog = sortedEtArr.find(
        (log) =>
          log.exercise_id === exercise.exercise_id &&
          new Date(log.workoutdate) < new Date(currentDate)
      );

      if (lastLog) {
        const isLastWorkout = isExerciseInLastWorkoutWithSameType(
          exercise.exercise_id,
          lastWorkoutWithSameType
        );
        previousWorkout.push({ ...lastLog, isLastWorkout });
      }
    });

    //console.log(
    // "Found previous workout:",
    // JSON.stringify(previousWorkout, null, 2)
    // );

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

    const currentDate = exerciseTrackingByDate[0].workoutdate;
    const splitName = exerciseTrackingByDate[0].splitname;

    let lastWorkout = [];
    let prevDate = "";

    for (let j = sortedEtArr.length - 1; j >= 0; j--) {
      const entry = sortedEtArr[j];
      if (entry.splitname === splitName && entry.workoutdate < currentDate) {
        if (!prevDate) {
          prevDate = entry.workoutdate;
        }

        if (entry.workoutdate !== prevDate) {
          break;
        }

        lastWorkout.push(entry);
      }
    }

    //console.log("PREVIOUS WORKOUT FULL:", JSON.stringify(lastWorkout, null, 2));
    return lastWorkout;
  }

  return [];
};

export const isSetPR = (exerciseTracking, weight) => {
  let allWeightArr = exerciseTracking.flatMap((et) => et.weight);
  return weight == Math.max(...allWeightArr);
};

// Mapping exercise tracking with key(date):value(all records)
export const getExerciseTrackingMappedByDate = (exerciseTracking) => {
  return exerciseTracking.reduce((acc, record) => {
    acc[record.workoutdate]
      ? acc[record.workoutdate].push(record)
      : (acc[record.workoutdate] = [record]);
    return acc;
  }, {});
};
