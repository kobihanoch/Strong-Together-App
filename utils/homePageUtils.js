export const getUserLastWorkoutDate = (exercisesArr) => {
  if (!exercisesArr || exercisesArr.length == 0) {
    return "No data yet";
  }
  const sortedEtArr = [...exercisesArr].sort(
    (a, b) => new Date(b.workoutdate) - new Date(a.workoutdate)
  );
  return sortedEtArr[0].workoutdate;
};

export const getUserGeneralPR = (exercisesLogsForUser) => {
  const PRS = {};
  let maxWeight = 0;
  let maxExercise = null;
  let maxReps = 0;
  let dateOfPr = null;
  exercisesLogsForUser.forEach((exerciseInTrackingData) => {
    const weightArr = exerciseInTrackingData.weight;
    const repsArr = exerciseInTrackingData.reps;
    const maxWeightInArray = Math.max(...weightArr);
    if (maxWeightInArray > maxWeight) {
      maxWeight = maxWeightInArray;
      maxExercise = exerciseInTrackingData.exercise;
      const index = weightArr.indexOf(maxWeightInArray);
      maxReps = repsArr[index];
      dateOfPr = exerciseInTrackingData.workoutdate;
    }
  });
  return {
    maxWeight,
    maxReps,
    maxExercise,
    dateOfPr,
  };
};

export const getDaysSince = (lastDateString) => {
  const lastDate = new Date(lastDateString);
  const today = new Date();

  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  console.log(diffDays);

  switch (diffDays) {
    case 0:
      return "today";
    case 1:
      return "yesterday";
    default:
      if (diffDays < 30) {
        return `${diffDays} days ago`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} mo${months > 1 ? "s" : ""} ago`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years} yr${years > 1 ? "s" : ""} ago`;
      }
  }
};

export const getWelcomeMessageString = (fullName) => {
  return {
    header: `Welcome to Strong Together, ${fullName.split(" ")[0]}!`,
    text: "We're happy to have you with us. Your fitness journey begins now — let’s make it count!\n\nYou don’t have an active workout plan yet. To get started, go to the Home page and create one.\n\nYou can choose between 1 to 6 workout splits and add your favorite exercises to each.\n\nIf you have any questions, feel free to ask our AI trainer anytime.\n\nGood luck!\nThe Strong Together Team",
  };
};
