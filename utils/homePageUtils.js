export const getUserLastWorkoutDate = (exercisesArr) => {
  const sortedEtArr = [...exercisesArr].sort(
    (a, b) => new Date(b.workoutdate) - new Date(a.workoutdate)
  );
  console.log("Asdasdsdassasddsdsd" + sortedEtArr[0].workoutdate);
  return sortedEtArr[0].workoutdate;
};
