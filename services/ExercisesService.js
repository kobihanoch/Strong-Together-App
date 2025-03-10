import supabase from "../src/supabaseClient";

export const getAllExercises = async () => {
  try {
    const { data, error } = await supabase.from("exercises").select("*");

    if (error) {
      console.error("Error fetching exercises:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};
