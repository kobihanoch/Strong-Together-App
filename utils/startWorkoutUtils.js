/* 
[
  {"exercisetosplit_id": 1251, "notes": "Was easy!", "reps": [12], "user_id": NULL, "weight": [20.5]},
  ...
]
Passing null to server to avoid injections
*/
export const createArrayForDataBase = (workoutObj) => {
  if (!Object.keys(workoutObj).length) return [];
  const arr = Object.entries(workoutObj).map(([exName, records]) => {
    // Iterating for each exercise
    const wArr = records.weight;
    const rArr = records.reps;
    const { weight, reps } = dropInvalidPairs(wArr, rArr);
    const etsid = records.etsid;
    const notes = records.notes;
    if (weight.length && reps.length && etsid) {
      return {
        exercisetosplit_id: etsid,
        weight: weight,
        reps: reps,
        notes: notes,
      };
    }
  });
  const filteredArr = arr.filter((ex) => ex != null && ex != undefined);
  //console.log(filteredArr);
  return filteredArr;
};

const dropInvalidPairs = (weights = [], reps = []) => {
  const isValid = (v) => Number.isFinite(+v) && +v !== 0;

  // Take the shortest length to avoid out-of-bounds
  const maxLen = Math.min(weights.length, reps.length);

  const filteredWeights = weights
    .slice(0, maxLen)
    .filter((_, i) => isValid(weights[i]) && isValid(reps[i]));

  const filteredReps = reps
    .slice(0, maxLen)
    .filter((_, i) => isValid(weights[i]) && isValid(reps[i]));

  return {
    weight: filteredWeights,
    reps: filteredReps,
  };
};

/*
 * Compute progress normalized to 0..10.
 * Primary metric: volume ratio (weight * reps) vs previous workout for the same set.
 * Fallback: if no previous data -> ratio of current reps to target reps.
 */
export function computeProgressByVolume({
  currReps,
  currWeight,
  prevReps,
  prevWeight,
  targetReps,
  hasLastWorkout,
}) {
  // Normalize inputs once (do this BEFORE any branch)
  const CR = Number(currReps ?? 0);
  const CW = Number(currWeight ?? 0);
  const PR = prevReps == null ? null : Number(prevReps);
  const PW = prevWeight == null ? null : Number(prevWeight);
  const TR = Number(targetReps ?? 0);

  // Determine if we actually have previous data for THIS set
  const hasPrev = PR != null && PW != null && (hasLastWorkout ?? true);

  if (hasPrev) {
    const currVol = CR > 0 && CW > 0 ? CR * CW : 0;
    const prevVol = PR > 0 && PW > 0 ? PR * PW : 0;

    if (prevVol > 0) {
      const ratio = currVol / prevVol; // 1.0 = matched last time
      const normalized = clamp(ratio, 0, 1) * 10;
      return Number.isFinite(normalized) ? normalized : 0;
    }
    // If previous exists but has zero volume, treat as 0 progress (or fall back to target)
    if (TR > 0) {
      const ratio = CR / TR; // optional fallback to target
      const normalized = clamp(ratio, 0, 1) * 10;
      return Number.isFinite(normalized) ? normalized : 0;
    }
    return 0;
  }

  // No previous data -> fallback to target reps
  if (TR > 0) {
    const ratio = CR / TR; // 1.0 = met target reps
    const normalized = clamp(ratio, 0, 1) * 10;
    return Number.isFinite(normalized) ? normalized : 0;
  }

  return 0;
}
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export const countSetsDone = (
  workoutProgressObj,
  exercisesForSelectedSplit
) => {
  let total = 0;

  for (const [name, rec] of Object.entries(workoutProgressObj)) {
    const planned =
      exercisesForSelectedSplit.find((e) => e.exercise === name)?.sets
        ?.length ?? 0;

    const wArr = rec?.weight ?? [];
    const rArr = rec?.reps ?? [];

    // Count a set only when both fields were updated for the same index
    for (let i = 0; i < planned; i++) {
      const bothUpdated = i in wArr && i in rArr;
      if (bothUpdated) total++;
    }
  }

  return total;
};

// utils/workoutAdders.js

// Shape: state[exerciseName] = { etsid, weight: [], reps: [], notes }

export const applyWeight = (state, exerciseName, setIndex, weight) => {
  // Guard: valid state/exercise and non-negative integer index
  if (
    !state ||
    !state[exerciseName] ||
    !Number.isInteger(setIndex) ||
    setIndex < 0
  )
    return state;

  const ex = state[exerciseName];
  const current = Array.isArray(ex.weight) ? ex.weight : [];

  // No-op if value did not change
  if (current[setIndex] === weight) return state;

  // Immutable update
  const nextWeight = current.slice();
  nextWeight[setIndex] = weight;

  return {
    ...state,
    [exerciseName]: { ...ex, weight: nextWeight },
  };
};

export const applyReps = (state, exerciseName, setIndex, reps) => {
  // Guard: valid state/exercise and non-negative integer index
  if (
    !state ||
    !state[exerciseName] ||
    !Number.isInteger(setIndex) ||
    setIndex < 0
  )
    return state;

  const ex = state[exerciseName];
  const current = Array.isArray(ex.reps) ? ex.reps : [];

  // No-op if value did not change
  if (current[setIndex] === reps) return state;

  // Immutable update
  const nextReps = current.slice();
  nextReps[setIndex] = reps;

  return {
    ...state,
    [exerciseName]: { ...ex, reps: nextReps },
  };
};

export const applyNotes = (state, exerciseName, notes) => {
  // Guard: valid state/exercise
  if (!state || !state[exerciseName]) return state;

  const ex = state[exerciseName];
  if (ex.notes === notes) return state; // No-op

  return {
    ...state,
    [exerciseName]: { ...ex, notes },
  };
};
