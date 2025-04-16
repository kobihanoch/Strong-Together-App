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

// Gets user workout learning
export const getUserWorkout = async (userId) => {
  const { data, error } = await supabase
    .from("workoutplans")
    .select(
      "*, workoutsplits(*, exercisetoworkoutsplit(*, exercises (description, targetmuscle, specifictargetmuscle)))"
    )
    .eq("user_id", userId)
    .single();
  if (error) {
    console.log(error);
  }
  //console.log(">>>>>>>>>>>>>>>>>>>", data);
  return data;
};

// Gets user workout learning
export const getUserExerciseTracking = async (userId) => {
  const { data, error } = await supabase
    .from("exercisetracking")
    .select(
      "*, exercisetoworkoutsplit(exercises(targetmuscle, specifictargetmuscle))"
    )
    .eq("user_id", userId);
  console.log("WorkoutService: exercisetracking were fetched successfully!");
  return data;
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
        name: name,
        numberofsplits: splitsNumber,
        //created_at: new Date().toISOString(),
      },
    ])
    .select("id")
    .single();

  if (error) {
    //console.error("Error inserting workout:", error.message);
    throw error;
  }

  if (!data || data.length === 0) {
    //console.error("Error: No data returned after inserting workout.");
    throw new Error("Workout creation failed.");
  }

  //console.log("Workout created successfully:", data);
  return data;
};

// Saves a workout after working out - startworkout.js
export const saveWorkoutData = async (dataOfWorkout) => {
  if (!dataOfWorkout) {
    return;
  }
  console.log(
    "Got here and inserting " + JSON.stringify(dataOfWorkout, null, 2)
  );
  const { error } = await supabase
    .from("exercisetracking")
    .insert(dataOfWorkout);

  if (error) throw error;

  console.log("Workout saved succesfully");
};
