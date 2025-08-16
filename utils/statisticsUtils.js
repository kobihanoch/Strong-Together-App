// Mapping exercise tracking with keys:
// {
//   byDate: { [YYYY-MM-DD]: Record[] }, SORTED FROM NEW (FIRST) TO OLD(LAST)
//   byETSId: { [exercisetosplit_id]: Record[] },
//   bySplitName: { [splitname]: Record[] }.
//   splitDatesDesc: { [splitName]: all dates DESC }
// }
export const getExerciseTrackingMapped = (exerciseTracking = []) => {
  if (!exerciseTracking || !exerciseTracking.length)
    return { byDate: {}, byETSId: {}, bySplitName: {}, splitDatesDesc: {} };
  const mapped = exerciseTracking.reduce(
    (acc, r) => {
      (acc.byDate[r.workoutdate] ??= []).push(r);
      (acc.byETSId[r.exercisetosplit_id] ??= []).push(r);
      (acc.bySplitName[r.splitname] ??= []).push(r);
      return acc;
    },
    { byDate: {}, byETSId: {}, bySplitName: {} }
  );

  const byDate = Object.fromEntries(
    Object.keys(mapped.byDate)
      .sort()
      .reverse()
      .map((d) => [d, [...mapped.byDate[d]]])
  );

  const byETSId = {};
  Object.entries(mapped.byETSId).forEach(([id, arr]) => {
    byETSId[id] = [...arr].sort((a, b) =>
      b.workoutdate.localeCompare(a.workoutdate)
    );
  });

  const bySplitName = {};
  Object.entries(mapped.bySplitName).forEach(([sn, arr]) => {
    bySplitName[sn] = [...arr].sort((a, b) =>
      b.workoutdate.localeCompare(a.workoutdate)
    );
  });

  const splitDatesDesc = {};
  for (const [sn, arr] of Object.entries(bySplitName)) {
    splitDatesDesc[sn] = [...new Set(arr.map((r) => r.workoutdate))];
  }

  return { byDate, byETSId, bySplitName, splitDatesDesc };
};

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
export const isSetPR = (etsId, weight, byETSid) => {
  const allWeightsRecordForExercise = byETSid[etsId].flatMap(
    (record) => record.weight
  );
  return weight == Math.max(...allWeightsRecordForExercise);
};

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
