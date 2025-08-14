import { useEffect, useState } from "react";
import api from "../api/api";

const useExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data } = await api.get("/api/exercises/getall");
        setExercises(data);
      } catch (e) {
        console.log(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return { exercises, error, loading };
};

export default useExercises;
