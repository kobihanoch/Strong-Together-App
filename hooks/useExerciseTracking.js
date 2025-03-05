import { useState, useEffect } from "react";
import {
  getExercisesTrackingByUserId,
  getMostFrequentSplitNameByUserId,
} from "../services/ExerciseTrackingService";

const useExerciseTracking = (userId) => {
  const [trackingData, setTrackingData] = useState([]);
  const [mostFrequentSplit, setMostFrequentSplit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      if (userId) {
        setLoading(true);
        try {
          const data = await getExercisesTrackingByUserId(userId);
          setTrackingData(data);

          const frequentSplit = await getMostFrequentSplitNameByUserId(userId);
          setMostFrequentSplit(frequentSplit);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTrackingData();
  }, [userId]);

  return { trackingData, mostFrequentSplit, loading, error };
};

export default useExerciseTracking;
