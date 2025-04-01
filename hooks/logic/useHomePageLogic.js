import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useUserWorkout } from "../useUserWorkout";
import React from "react";
import { getUserLastWorkoutDate } from "../../utils/homePageUtils";

const useHomePageLogic = (user) => {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const {
    refetch,
    userWorkout,
    loading: workoutLoading,
    error,
    exerciseTracking,
    fetchUserExerciseTracking,
  } = useUserWorkout(user?.id);

  const [hasAssignedWorkout, setHasAssignedWorkout] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null);
  const [loading, setLoading] = useState(true); // ← נוספה שליטה ידנית ב-loading

  // Set username after user is loaded
  useEffect(() => {
    const loadData = async () => {
      if (user && user.username && user.id) {
        setLoading(true); // מתחיל טעינה
        try {
          await fetchUserExerciseTracking();
          setUsername(user.username);
          setFirstName(user.name.split(" ")[0]);
          setUserId(user.id);
          setProfileImageUrl(user.profile_image_url);
        } catch (err) {
          console.error("Error fetching exercise tracking:", err);
        } finally {
          setLoading(false); // סיום טעינה בכל מקרה
        }
      }
    };

    loadData();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        refetch();
      }
    }, [user?.id])
  );

  // Set user's assigned workout state after user is loaded
  useEffect(() => {
    setHasAssignedWorkout(userWorkout && userWorkout.length > 0);
  }, [userWorkout]);

  useEffect(() => {
    if (Array.isArray(exerciseTracking) && exerciseTracking.length > 0) {
      setLastWorkoutDate(getUserLastWorkoutDate(exerciseTracking));
    }
  }, [exerciseTracking]);

  return {
    username,
    userId,
    hasAssignedWorkout,
    profileImageUrl,
    firstName,
    loading,
    error,
    lastWorkoutDate,
  };
};

export default useHomePageLogic;
