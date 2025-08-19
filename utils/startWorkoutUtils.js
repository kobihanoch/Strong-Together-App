export const createObjectForDataBase = (
  userId,
  weights,
  reps,
  workoutDetails
) => {
  if (!workoutDetails) return;
  let objs = [];
  //console.log("Workut details: " + JSON.stringify(workoutDetails, null, 2));
  for (let i = 0; i < workoutDetails.length; i++) {
    if (
      weights[i] &&
      reps[i] &&
      weights[i].length != 0 &&
      reps[i].length != 0
    ) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");

      const formattedDate = `${yyyy}-${mm}-${dd}`;
      objs.push({
        user_id: userId,
        exercisetosplit_id: workoutDetails[i].id,
        workoutdate: formattedDate,
        weight: weights[i],
        reps: reps[i],
      });
    }
  }
  //console.log(JSON.stringify(objs, null, 2));
  return objs;
};

export const filterZeroesInArr = (reps, weights) => {
  const filteredReps = [];
  const filteredWeights = [];

  for (let i = 0; i < reps.length; i++) {
    const repSet = reps[i];
    const weightSet = weights[i];

    if (Array.isArray(repSet) && Array.isArray(weightSet)) {
      const newRepSet = [];
      const newWeightSet = [];

      for (let j = 0; j < repSet.length; j++) {
        const rep = repSet[j];
        const weight = weightSet[j];

        if (rep !== 0 && weight !== 0 && rep != null && weight != null) {
          newRepSet.push(rep);
          newWeightSet.push(weight);
        }
      }

      filteredReps.push(newRepSet);
      filteredWeights.push(newWeightSet);
    } else {
      filteredReps.push(repSet);
      filteredWeights.push(weightSet);
    }
  }
  return { reps: filteredReps, weights: filteredWeights };
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
