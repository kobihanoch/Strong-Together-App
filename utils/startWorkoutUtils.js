export const createObjectForDataBase = (
  userId,
  weights,
  reps,
  workoutDetails
) => {
  if (!workoutDetails) return;
  let objs = [];
  console.log("Workut details: " + JSON.stringify(workoutDetails, null, 2));
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
        workoutDate: formattedDate,
        weight: weights[i],
        reps: reps[i],
      });
    }
  }
  console.log(JSON.stringify(objs, null, 2));
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
