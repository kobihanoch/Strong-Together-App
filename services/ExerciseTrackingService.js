import supabase from "../src/supabaseClient";

export const getExercisesTrackingByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("exercisetracking")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

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

    data.forEach(({ workoutsplit_id, splitname, workoutdate }) => {
      if (!frequencyMap[workoutsplit_id]) {
        frequencyMap[workoutsplit_id] = {
          splitname,
          workoutDates: new Set(),
        };
      }
      frequencyMap[workoutsplit_id].workoutDates.add(workoutdate);
    });

    let maxCount = 0;
    let mostFrequentSplit = {
      workoutsplit_id: null,
      splitname: null,
      maxCount,
    };

    Object.entries(frequencyMap).forEach(
      ([workoutsplit_id, { workoutDates, splitname }]) => {
        const count = workoutDates.size;
        if (count > maxCount) {
          maxCount = count;
          mostFrequentSplit = {
            workoutsplit_id,
            splitname,
            maxCount,
          };
        }
      }
    );

    return mostFrequentSplit;
  } catch (error) {
    console.error("Error fetching most frequent split name:", error.message);
    throw error;
  }
};
