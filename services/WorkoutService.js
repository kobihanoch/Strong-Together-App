import supabase from "../src/supabaseClient";

// Fetch workouts by user ID
export const fetchWorkoutsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("workoutplans")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

// A function for learning
export const getUserWorkout = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      "*, workoutplans!workoutplans_user_id_fkey(*, workoutsplits(*, exercisetoworkoutsplit(*)))"
    )
    .eq("id", userId);
  console.log(
    "WorkoutService: User + Workout + Splits + Exercises were fetched successfully!"
  );
  return data[0].workoutplans;
};

// Removes a workout plan
export const deleteWorkout = async (userId) => {
  if (!userId) {
    console.log("Error: user not found.");
    return;
  }
  const { data, error } = await supabase
    .from("workoutplans")
    .delete()
    .eq("user_id", userId);
  if (error) {
    console.log("Error occured deleting a workout: " + error);
    throw error;
  }
  return data;
};

// Add a new workout plan
export const addWorkout = async (userId, name, splitsNumber) => {
  if (!userId) {
    console.error("Error: userId is missing.");
    throw new Error("User ID is required.");
  }

  console.log("Adding workout for user:", userId);

  const { data, error } = await supabase
    .from("workoutplans")
    .insert([
      {
        user_id: userId,
        trainer_id: userId,
        name: name || "My Custom Workout",
        numberofsplits: splitsNumber,
        created_at: new Date().toISOString(),
      },
    ])
    .select("*");

  if (error) {
    console.error("Error inserting workout:", error.message);
    throw error;
  }

  if (!data || data.length === 0) {
    console.error("Error: No data returned after inserting workout.");
    throw new Error("Workout creation failed.");
  }

  console.log("Workout created successfully:", data[0]);
  return data[0];
};
