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

// Add multiple exercises to a specific workout split
export const addExercisesToSplit = async (splitId, exercises) => {
  if (!Array.isArray(exercises) || exercises.length === 0) {
    console.warn(`⚠️ No exercises to insert for split ID: ${splitId}`);
    return;
  }

  const exercisesToInsert = exercises.map((exercise) => ({
    workoutsplit_id: splitId,
    exercise_id: exercise.id,
  }));

  try {
    const { data, error } = await supabase
      .from("exercisetoworkoutsplit")
      .insert(exercisesToInsert)
      .select("*");

    if (error) throw error;
    console.log(`✅ Successfully added exercises to split ${splitId}:`, data);
    return data;
  } catch (err) {
    console.error("❌ Error adding exercises to workout split:", err.message);
    throw err;
  }
};

// Add a single exercise to a workout split
export const addExerciseToSplit = async ({
  workoutsplit_id,
  exercise_id,
  created_at,
}) => {
  try {
    if (!workoutsplit_id || !exercise_id) {
      console.error("❌ ERROR: Missing required fields:", {
        workoutsplit_id,
        exercise_id,
      });
      return;
    }

    const { data, error } = await supabase
      .from("exercisetoworkoutsplit")
      .insert([{ workoutsplit_id, exercise_id, created_at }])
      .select("*");

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
