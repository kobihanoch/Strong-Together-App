import supabase from "../src/supabaseClient";

// Add multiple workout splits - aeach obj with workout_id and name
export const addWorkoutSplits = async (splitsArray) => {
  const { data, error } = await supabase
    .from("workoutsplits")
    .insert(splitsArray)
    .select("id");

  if (error) {
    console.error("❌ Error inserting workout splits:", error.message);
    throw error;
  }

  if (!data || data.length === 0) {
    console.error("❌ No workout splits returned from Supabase.");
    throw new Error("Insert failed. No data returned.");
  }
  //console.log(data.map((item) => item.id));
  return data.map((item) => item.id);
};

// Update an existing workout split by ID (without muscle_group)
export const updateWorkoutSplit = async (id, name, createdAt) => {
  const { data, error } = await supabase
    .from("workoutsplits")
    .update({ name, created_at: createdAt })
    .eq("id", id);

  if (error) throw error;
  return data;
};

// Delete a workout split by ID
export const deleteWorkoutSplit = async (id) => {
  const { data, error } = await supabase
    .from("workoutsplits")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return data;
};
