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
