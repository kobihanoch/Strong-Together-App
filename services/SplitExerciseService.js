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
  const promises = [];

  // 1. Handle DELETIONS: Delete exercises that no longer exist in the new split array
  for (const oldEx of oldExArray) {
    const stillExists = newSplitArray.some((split) =>
      split.exercises.some((newEx) => newEx.id === oldEx.id)
    );

    if (!stillExists) {
      const deletePromise = supabase
        .from("exercisetoworkoutsplit")
        .delete()
        .eq("id", oldEx.id)
        .then(({ error }) => {
          if (error) throw error;
          console.log("🗑️ Deleted exercise with id:", oldEx.id);
        });
      promises.push(deletePromise);
    }
  }

  // 2. Handle INSERTS and UPDATES
  for (const split of newSplitArray) {
    for (const ex of split.exercises) {
      const matchingOldExercise = oldExArray.find(
        (oldEx) => oldEx.id === ex.id
      );
      const isNewExercise = ex.id == null; // New exercise if no id exists

      if (isNewExercise) {
        const insertPromise = getSplitIdByUserIdAndSplitName(userId, split.name)
          .then((workoutSplitId) => {
            return supabase.from("exercisetoworkoutsplit").insert([
              {
                workoutsplit_id: workoutSplitId,
                exercise_id: ex.exercise_id,
                sets: ex.sets,
              },
            ]);
          })
          .then(({ error }) => {
            if (error) throw error;
            console.log("✅ Inserted new exercise");
          });

        promises.push(insertPromise);
      } else if (matchingOldExercise) {
        // Existing exercise – check if sets have changed
        const areSetChanged =
          JSON.stringify(ex.sets) !== JSON.stringify(matchingOldExercise.sets);

        if (areSetChanged) {
          // Update sets if they changed
          const updatePromise = supabase
            .from("exercisetoworkoutsplit")
            .update({
              sets: ex.sets,
            })
            .eq("id", ex.id)
            .then(({ error }) => {
              if (error) throw error;
              console.log("✏️ Updated sets for exercise id:", ex.id);
            });
          promises.push(updatePromise);
        } else {
          console.log("🟰 Exercise with id", ex.id, "was not changed.");
        }
      }
    }
  }

  // Wait for all promises to complete (delete/update operations)
  await Promise.all(promises);

  console.log("✅✅ All exercises synchronized successfully.");
};
