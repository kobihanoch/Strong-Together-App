// hooks/fetchWorkoutMuscles.js
import supabase from "../src/supabaseClient";

const fetchWorkoutMuscles = async (workoutSplitId) => {
  try {
    const { data, error } = await supabase
      .from("workoutsplits")
      .select("muscle_group")
      .eq("id", workoutSplitId)
      .single();

    if (error) throw error;

    return data?.muscle_group
      ? data.muscle_group.split(",").map((muscle) => muscle.trim())
      : [];
  } catch (error) {
    console.error(
      `Error fetching muscles for workoutSplit ${workoutSplitId}:`,
      error
    );
    return [];
  }
};

export default fetchWorkoutMuscles;
