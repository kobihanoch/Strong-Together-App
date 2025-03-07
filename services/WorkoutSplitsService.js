import supabase from "../src/supabaseClient";

// Fetch all workout splits by workout ID
export const fetchWorkoutSplitsByWorkoutId = async (workoutId) => {
  const { data, error } = await supabase
    .from("workoutsplits")
    .select("*")
    .eq("workout_id", workoutId);

  if (error) throw error;
  return data;
};

// Fetch all workout splits by user ID
export const fetchWorkoutSplitsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("workoutsplits")
    .select("*, workoutplans!inner(user_id)")
    .eq("workoutplans.user_id", userId);

  if (error) throw error;
  return data;
};

// Add a new workout split (without muscle_group)
export const addWorkoutSplit = async (workoutId, name, createdAt) => {
  const { data, error } = await supabase
    .from("workoutsplits")
    .insert([{ workout_id: workoutId, name, created_at: createdAt }]);

  if (error) throw error;
  return data;
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

// Fetch all workout split data by workoutsplit_id
export const fetchWorkoutSplitById = async (workoutsplit_id) => {
  const { data, error } = await supabase
    .from("workoutsplits")
    .select("*")
    .eq("id", workoutsplit_id)
    .single();

  if (error) throw error;
  return data;
};
