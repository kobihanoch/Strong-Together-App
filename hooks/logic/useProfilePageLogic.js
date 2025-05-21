import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUserWorkout } from "../useUserWorkout";
import { getDaysSince } from "../../utils/homePageUtils";

const useProfilePageLogic = (user) => {
  const { updateProfilePic, workout } = useAuth();
  const { exerciseTracking } = workout;
  const [mediaLoading, setMediaLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [loading, setLoading] = useState(null);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [daysOnline, setDaysOnline] = useState(0);

  // Initial load
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setUsername(user.username);
        setEmail(user.email);
        setFullname(user.name);
        const dataOfCreation = user.created_at.split("T")[0];
        setDaysOnline(getDaysSince(dataOfCreation));
      } catch (err) {
        console.log(err);
        throw err;
      }
    })();
  }, [user]);
  useEffect(() => {
    const uniWorkouts = new Set();
    if (exerciseTracking && exerciseTracking.length > 0) {
      exerciseTracking.forEach((exerciseInTrackingData) => {
        uniWorkouts.add(exerciseInTrackingData.workoutdate);
      });
      setWorkoutCount(uniWorkouts.size);
      setLoading(false);
    }
  }, [exerciseTracking]);

  return {
    data: {
      username,
      email,
      fullname,
      workoutCount,
      daysOnline,
    },
    updateProfilePic,
    loading,
    mediaLoading,
    setMediaLoading,
  };
};

export default useProfilePageLogic;
