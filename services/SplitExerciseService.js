import supabase from "../src/supabaseClient";

// Add multiple exercises to a specific workout split - {id, workoutsplit_id}
export const addExercisesToSplit = async (exArray) => {
  const { data, error } = await supabase
    .from("exercisetoworkoutsplit")
    .insert(exArray);

  if (error) throw error;
  console.log(`✅ Successfully added exercises to split.`);
};

export const getSplitIdByUserIdAndSplitName = async (userId, splitName) => {
  const { data, error } = await supabase
    .from("workoutplans")
    .select("workoutsplits(id, name), user_id")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  // Flatten all splits
  const allSplits = data.flatMap((plan) => plan.workoutsplits);

  // Now find the matching split
  const matchingSplit = allSplits.find((split) => split.name === splitName);

  if (!matchingSplit) {
    throw new Error("No matching split found for user.");
  }

  return matchingSplit.id;
};

export const updateExercisesToSplit = async (
  newSplitArray,
  oldExArray,
  userId
) => {
  /*console.log("🔄 updateExercisesToSplit called with:");
  console.log("  newSplitArray:", JSON.stringify(newSplitArray, null, 2));
  console.log("  oldExArray:   ", JSON.stringify(oldExArray, null, 2));
  console.log("  userId:", userId);*/

  const promises = [];

  // 1. Handle DELETIONS
  for (const oldEx of oldExArray || []) {
    //console.log("⛔️ Checking deletion for oldEx:", oldEx);
    const stillExists = (newSplitArray || []).some((split) =>
      split.exercises.some((newEx) => newEx.id === oldEx.id)
    );
    //console.log("   stillExists =", stillExists);

    if (!stillExists) {
      const deletePromise = supabase
        .from("exercisetoworkoutsplit")
        .delete()
        .eq("id", oldEx.id)
        .then((res) => {
          console.log("   Delete response for id", oldEx.id, "→", res);
          if (res.error) throw res.error;
        });
      promises.push(deletePromise);
    }
  }

  // 2. Handle INSERTS and UPDATES
  for (const split of newSplitArray || []) {
    //console.log("🗂 Processing split:", split);
    for (const ex of split.exercises || []) {
      //console.log("   ▶️  Processing exercise:", ex);
      const matchingOldExercise = (oldExArray || []).find(
        (oldEx) => oldEx.id === ex.id
      );
      const isNewExercise = ex.id == null;
      //console.log("     matchingOldExercise:", matchingOldExercise);
      //console.log("     isNewExercise:", isNewExercise);

      if (isNewExercise) {
        //console.log("     ➕ Inserting new exercise for split:", split.name);
        const insertPromise = getSplitIdByUserIdAndSplitName(userId, split.name)
          .then((workoutSplitId) => {
            //console.log("       → Resolved workoutSplitId:", workoutSplitId);
            if (!workoutSplitId) {
              throw new Error(
                "workoutSplitId is undefined for split " + split.name
              );
            }
            return supabase.from("exercisetoworkoutsplit").insert([
              {
                workoutsplit_id: workoutSplitId,
                exercise_id: ex.exercise_id,
                sets: ex.sets,
              },
            ]);
          })
          .then((res) => {
            //console.log("       Insert response:", res);
            if (res.error) throw res.error;
          });
        promises.push(insertPromise);
      } else if (matchingOldExercise) {
        const setsOld = matchingOldExercise.sets;
        const setsNew = ex.sets;
        const areSetsChanged =
          JSON.stringify(setsNew) !== JSON.stringify(setsOld);
        //console.log("     ✏️  setsOld:", setsOld, "setsNew:", setsNew);
        //console.log("        areSetsChanged:", areSetsChanged);

        if (areSetsChanged) {
          const updatePromise = supabase
            .from("exercisetoworkoutsplit")
            .update({ sets: setsNew })
            .eq("id", ex.id)
            .then((res) => {
              console.log("       Update response for id", ex.id, ":", res);
              if (res.error) throw res.error;
            });
          promises.push(updatePromise);
        } else {
          //console.log("     🟰 No change for exercise id:", ex.id);
        }
      } else {
        //console.warn("     ⚠️  Exercise id", ex.id, "not found in oldExArray");
      }
    }
  }

  // 3. Await all
  try {
    await Promise.all(promises);
    console.log("✅✅ All exercises synchronized successfully.");
  } catch (err) {
    console.error("❌ Error during updateExercisesToSplit:", err);
    throw err;
  }
};
