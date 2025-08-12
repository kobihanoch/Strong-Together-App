import supabase from "../src/supabaseClient";

// Need to delete => advanced
export const getMostFrequentSplitNameByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("exercisetracking")
      .select("workoutsplit_id, splitname, workoutdate")
      .eq("user_id", userId);

    if (error) throw error;
    if (!data || data.length === 0)
      return {
        workoutsplit_id: null,
        splitname: null,
        maxCount: 0,
      };

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
