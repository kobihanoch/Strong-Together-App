import supabase from "../src/supabaseClient";

export const getExercisesTrackingByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "workoutplans!workoutplans_user_id_fkey(workoutsplits(exercisetoworkoutsplit(*)))"
      )
      .eq("id", userId);

    if (error) throw error;

    //console.log("Fetched exercise tracking data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching exercise tracking data:", error.message);
    throw error;
  }
};

export const getExercisesTrackingByUserIdDateAndSplit = async (
  userId,
  workoutDate,
  splitId
) => {
  try {
    const { data, error } = await supabase
      .from("exercisetracking")
      .select("*")
      .eq("user_id", userId)
      .eq("workoutdate", workoutDate)
      .eq("workoutsplit_id", splitId);

    if (error) throw error;

    console.log(
      "Fetched exercise tracking data by user, date, and split ID:",
      data
    );
    return data;
  } catch (error) {
    console.error("Error fetching exercise tracking data:", error.message);
    throw error;
  }
};

export const getMostFrequentSplitNameByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("exercisetracking")
      .select("workoutsplit_id, splitname, workoutdate")
      .eq("user_id", userId);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    const frequencyMap = {};

    data.forEach(({ workoutsplit_id, splitname }) => {
      if (!frequencyMap[workoutsplit_id]) {
        frequencyMap[workoutsplit_id] = { count: 0, splitname };
      }
      frequencyMap[workoutsplit_id].count += 1;
    });

    let mostFrequentSplit = { workoutsplit_id: null, splitname: null };
    let maxCount = 0;

    Object.entries(frequencyMap).forEach(
      ([workoutsplit_id, { count, splitname }]) => {
        if (count > maxCount) {
          maxCount = count;
          mostFrequentSplit = { workoutsplit_id, splitname };
        }
      }
    );

    // console.log("Most frequent split for user:", mostFrequentSplit);
    return mostFrequentSplit;
  } catch (error) {
    console.error("Error fetching most frequent split name:", error.message);
    throw error;
  }
};
