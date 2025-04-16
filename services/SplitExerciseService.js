import supabase from "../src/supabaseClient";

// Fetch exercises by workout ID
export const getExercisesByWorkoutId = async (workoutId) => {
  try {
    const { data, error } = await supabase
      .from("exercisetoworkoutsplit")
      .select(
        `
                *,
                exercises (description, targetmuscle, specifictargetmuscle)
            `
      )
      .eq("workout_id", workoutId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching exercises by workout ID:", error.message);
    throw error;
  }
};

// Fetch exercises by split ID
export const getExercisesBySplitId = async (splitId) => {
  try {
    const { data, error } = await supabase
      .from("exercisetoworkoutsplit")
      .select(
        `
                *,
                exercises (description, targetmuscle, specifictargetmuscle)
            `
      )
      .eq("workoutsplit_id", splitId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching exercises by split ID:", error.message);
    throw error;
  }
};

// Add multiple exercises to a specific workout split - {id, workoutsplit_id}
export const addExercisesToSplit = async (exArray) => {
  const { data, error } = await supabase
    .from("exercisetoworkoutsplit")
    .insert(exArray);

  if (error) throw error;
  console.log(`✅ Successfully added exercises to split.`);
};

// Add a single exercise to a workout split
export const addExerciseToSplit = async (
  workoutsplit_id,
  exercise_id,
  sets
) => {
  console.log(
    "Service splitId ",
    workoutsplit_id,
    " Service exxerciID ",
    exercise_id
  );
  try {
    if (!workoutsplit_id || !exercise_id) {
      console.error("❌ ERROR: Missing required fields:", {
        workoutsplit_id,
        exercise_id,
      });
      return;
    }

    const created_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("exercisetoworkoutsplit")
      .insert([{ workoutsplit_id, exercise_id, created_at, sets }])
      .select("id");

    if (error) throw error;
    console.log(
      `✅ Successfully added exercise ${exercise_id} to split ${workoutsplit_id}:`,
      data
    );
    return data;
  } catch (err) {
    console.error("❌ Error adding exercise to workout split:", err.message);
    throw err;
  }
};
