// Mapping exercise tracking with keys:
// {
//   byDate: { [YYYY-MM-DD]: Record[] }, SORTED FROM NEW (FIRST) TO OLD(LAST)
//   byETSId: { [exercisetosplit_id]: Record[] },
//   bySplitName: { [splitname]: Record[] }.
//   splitDatesDesc: { [splitName]: all dates DESC }
// }
/*// PR for the same exercise
export const isSetPR = (
  exId: ExerciseEntity['id'],
  weight: ExerciseTrackingEntity['weight'],
  reps: ExerciseTrackingEntity['reps'],
  prsByExId,
  workoutDate,
) => {
  const prForExercise = prsByExId[exId];
  if (!prForExercise) return true;

  const { weight: prW, reps: prR } = prForExercise;
  if (weight >= prW && reps >= prR) {
    if (prForExercise.workoutdate == workoutDate) {
      return true;
    } else if (weight > prW && reps > prR) {
      return true;
    }
  }
  return false;
};*/

// Format a date string (YYYY-MM-DD) into "Mon DD, YYYY"
export const formatDate = (dateToFormat: string) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let year, month, day;

  // Handle both "YYYY-MM-DD" strings and Date objects
  if (typeof dateToFormat === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateToFormat)) {
    // Parse manually to avoid timezone issues
    [year, month, day] = dateToFormat.split('-').map((part) => parseInt(part, 10));
    // month is 1-based, convert to 0-based
    month = month - 1;
  } else {
    const dateObj = new Date(dateToFormat);
    year = dateObj.getFullYear();
    month = dateObj.getMonth();
    day = dateObj.getDate();
  }

  const monthName = monthNames[month];
  return `${monthName} ${day}, ${year}`;
};

export const formatTime = (min: number | null, sec: number | null) => {
  if (!min || !sec) return 'None';
  const hrs = Math.floor(min / 60);
  const mins = min - hrs * 60;
  const hrsText = hrs > 0 ? (hrs == 1 ? hrs + ' hr' : hrs + ' hrs') : null;
  const minText = mins > 0 ? (mins == 1 ? mins + ' min' : mins + ' mins') : null;
  const secText = hrs < 1 ? (sec > 0 ? (sec == 1 ? sec + ' sec' : sec + ' secs') : null) : null;
  return [hrsText, minText, secText].filter(Boolean).join(' ');
};

export const getDayAbbreviation = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Sun"
};
