import { useState, useEffect } from "react";
import supabase from "../src/supabaseClient";
import { getAllExercises } from "../services/ExercisesService";

const useExercises = (workoutSplitId = null) => {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exc = await getAllExercises();
        setExercises(getAllExercises);
      } catch (e) {
        console.log(e);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [workoutSplitId]);

  return { exercises, error, loading };
};

export default useExercises;
