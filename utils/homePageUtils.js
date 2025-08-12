export const getUserLastWorkoutDate = (exercisesArr) => {
  if (!exercisesArr || exercisesArr.length == 0) {
    return "No data yet";
  }
  const sortedEtArr = [...exercisesArr].sort(
    (a, b) => new Date(b.workoutdate) - new Date(a.workoutdate)
  );
  return sortedEtArr[0].workoutdate;
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
