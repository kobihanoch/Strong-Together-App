import supabase from "../src/supabaseClient";

// Add multiple exercises to a specific workout split - {id, workoutsplit_id}
export const addExercisesToSplit = async (exArray) => {
  const { data, error } = await supabase
    .from("exercisetoworkoutsplit")
    .insert(exArray);

  if (error) throw error;
  console.log(`✅ Successfully added exercises to split.`);
};

// Updates exercises
export const updateExercisesToSplit = async (exArray) => {
  for (const ex of exArray) {
    const { error } = await supabase
      .from("exercisetoworkoutsplit")
      .update({
        sets: ex.sets,
      })
      .eq("id", ex.id);

    if (error) {
      console.error(`❌ Error updating exercise ${ex.id}:`, error.message);
      throw error;
    }
  }

  console.log("✅ All exercises updated successfully.");
};
