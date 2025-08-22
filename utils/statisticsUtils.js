// Mapping exercise tracking with keys:
// {
//   byDate: { [YYYY-MM-DD]: Record[] }, SORTED FROM NEW (FIRST) TO OLD(LAST)
//   byETSId: { [exercisetosplit_id]: Record[] },
//   bySplitName: { [splitname]: Record[] }.
//   splitDatesDesc: { [splitName]: all dates DESC }
// }
/*export const getExerciseTrackingMapped = (exerciseTracking = []) => {
  if (!exerciseTracking || !exerciseTracking.length) {
    return { byDate: {}, byETSId: {}, bySplitName: {}, splitDatesDesc: {} };
  }

  // Helper: extract order_index from nested object with safe fallback
  const getOrderIndex = (r) =>
    r?.exercisetoworkoutsplit?.order_index ??
    r?.order_index ??
    Number.MAX_SAFE_INTEGER; // items without order_index go last

  // First pass: bucket rows
  const mapped = exerciseTracking.reduce(
    (acc, r) => {
      (acc.byDate[r.workoutdate] ??= []).push(r);
      (acc.byETSId[r.exercisetosplit_id] ??= []).push(r);
      (acc.bySplitName[r.splitname] ??= []).push(r);
      return acc;
    },
    { byDate: {}, byETSId: {}, bySplitName: {} }
  );

  // byDate:
  // - sort date keys DESC (newest first)
  // - for each date's array, sort by order_index ASC (stable ties by ids)
  const byDate = Object.fromEntries(
    Object.keys(mapped.byDate)
      .sort() // ascending
      .reverse() // descending (newest first)
      .map((d) => [
        d,
        [...mapped.byDate[d]].sort((a, b) => {
          const ai = getOrderIndex(a);
          const bi = getOrderIndex(b);
          if (ai !== bi) return ai - bi; // primary: order_index asc
          // tie-breakers to keep deterministic order
          return (
            (a.exercisetosplit_id ?? 0) - (b.exercisetosplit_id ?? 0) ||
            (a.exercise_id ?? 0) - (b.exercise_id ?? 0) ||
            (a.id ?? 0) - (b.id ?? 0)
          );
        }),
      ])
  );

  // byETSId: keep your original sort (by workoutdate DESC)
  const byETSId = {};
  Object.entries(mapped.byETSId).forEach(([id, arr]) => {
    byETSId[id] = [...arr].sort((a, b) =>
      b.workoutdate.localeCompare(a.workoutdate)
    );
  });

  // bySplitName: keep your original sort (by workoutdate DESC)
  const bySplitName = {};
  Object.entries(mapped.bySplitName).forEach(([sn, arr]) => {
    bySplitName[sn] = [...arr].sort((a, b) =>
      b.workoutdate.localeCompare(a.workoutdate)
    );
  });

  // Distinct dates per split, newest first (derived from bySplitName already sorted)
  const splitDatesDesc = {};
  for (const [sn, arr] of Object.entries(bySplitName)) {
    splitDatesDesc[sn] = [...new Set(arr.map((r) => r.workoutdate))];
  }

  return { byDate, byETSId, bySplitName };
};*/

export const getLastWorkoutForEachExercise = (
  date,
  byDate,
  bySplitName,
  byETSId,
  splitDatesDesc
) => {
  const etRecords = byDate[date];
  if (!Array.isArray(etRecords) || etRecords.length === 0) return [];

  // Iterate over each exercise record of selected date
  return etRecords.reduce((acc, ex) => {
    // Get all instances of specific exercise
    const etsArr = byETSId[ex.exercisetosplit_id] ?? [];

    // Find index of last log
    const iNow = etsArr.findIndex((r) => r.workoutdate === date);
    const lastLog =
      iNow >= 0 ? etsArr[iNow + 1] : etsArr.find((r) => r.workoutdate < date);

    // If no last log of exercise => Continue to next exercise
    if (!lastLog) return acc;

    // Get date of last workout same as this one
    const dates = splitDatesDesc?.[ex.splitname] ?? [
      ...new Set((bySplitName[ex.splitname] || []).map((r) => r.workoutdate)),
    ];
    const j = dates.indexOf(date);
    const lastSplitDate = j >= 0 ? dates[j + 1] : dates.find((d) => d < date);

    acc.push({
      ...lastLog,
      isLastWorkout: !!lastSplitDate && lastLog.workoutdate === lastSplitDate,
    });
    return acc;
  }, []);
};

// PR for the same exercise
export const isSetPR = (exId, weight, reps, prsByExId, workoutDate) => {
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
};

// Format a date string (YYYY-MM-DD) into "Mon DD, YYYY"
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

  let year, month, day;

  // Handle both "YYYY-MM-DD" strings and Date objects
  if (
    typeof dateToFormat === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateToFormat)
  ) {
    // Parse manually to avoid timezone issues
    [year, month, day] = dateToFormat
      .split("-")
      .map((part) => parseInt(part, 10));
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
