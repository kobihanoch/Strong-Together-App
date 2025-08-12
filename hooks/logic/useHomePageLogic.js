import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const useHomePageLogic = (user) => {
  // User data
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);

  // Workout from context and unpack
  const {
    workout,
    workoutSplits,
    exerciseTracking,
    analyzedExerciseTrackingData,
  } = useAuth().workout;

  // Inner states
  const [hasAssignedWorkout, setHasAssignedWorkout] = useState(false);
  const [mostFrequentSplit, setMostFrequentSplit] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalWorkoutNumber, setTotalWorkoutNumber] = useState(0);
  const [workoutSplitsNumber, setWorkoutSplitsNumber] = useState(0);
  const [PR, setPR] = useState({});

  // Set username after user is loaded
  useEffect(() => {
    const loadData = async () => {
      if (user && analyzedExerciseTrackingData) {
        setLoading(true);
        try {
          setUsername(user.username);
          setFirstName(user.name.split(" ")[0]);
          setUserId(user.id);
          setProfileImageUrl(user.profile_image_url);
          // Workout data
          setPR(analyzedExerciseTrackingData.pr);
          setTotalWorkoutNumber(analyzedExerciseTrackingData.workoutCount);
          setMostFrequentSplit(analyzedExerciseTrackingData.mostFrequentSplit);
          setTotalWorkoutNumber(analyzedExerciseTrackingData.workoutCount);
          setLastWorkoutDate(analyzedExerciseTrackingData.lastWorkoutDate);
        } catch (err) {
          console.error("Error fetching exercise tracking:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [user, analyzedExerciseTrackingData]);

  // Set user's assigned workout state after user is loaded
  useEffect(() => {
    setHasAssignedWorkout(!!workout);
  }, [workout]);

  // Set workout splits count
  useEffect(() => {
    if (workoutSplits) {
      setWorkoutSplitsNumber(workoutSplits.length);
    }
  }, [workoutSplits]);

  return {
    data: {
      username: username ?? "",
      userId: userId ?? "",
      hasAssignedWorkout: hasAssignedWorkout ?? false,
      profileImageUrl: profileImageUrl ?? "",
      firstName: firstName ?? "",
      lastWorkoutDate: lastWorkoutDate ?? "none",
      totalWorkoutNumber: totalWorkoutNumber ?? 0,
      workoutSplitsNumber: workoutSplitsNumber ?? 0,
      mostFrequentSplit: mostFrequentSplit ?? null,
      PR: PR ?? null,
      exerciseTracking: exerciseTracking ?? null,
    },
    loading,
  };
};

export default useHomePageLogic;
