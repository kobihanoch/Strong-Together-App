import React, { useEffect, useState } from "react";
import { getUserWorkout } from "../services/WorkoutService";

export const useUserWorkout = (userId) => {
  const [userWorkout, setUserWorkout] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    (async () => {
      try {
        console.log("Trying to fetch data from hook...");
        const data = await getUserWorkout(userId);
        setUserWorkout(data);
      } catch (err) {
        setError(err);
        console.log("Failed. Error: " + err);
      } finally {
        //await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        console.log(
          "useUserWorkout: Data fetched from hook succesfully! State was updated."
        );
      }
    })();
  }, [userId]);

  return { userWorkout, loading, error };
};
