import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useUserWorkout } from "../useUserWorkout";
import React from "react";
import {
  getUserGeneralPR,
  getUserLastWorkoutDate,
} from "../../utils/homePageUtils";

const useHomePageLogic = (user) => {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const {
    refetch,
    userWorkout,
    workoutSplits,
    loading: workoutLoading,
    error,
    exerciseTracking,
    fetchUserExerciseTracking,
    mostFrequentSplit,
  } = useUserWorkout(user?.id);

  const [hasAssignedWorkout, setHasAssignedWorkout] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalWorkoutNumber, setTotalWorkoutNumber] = useState(0);
  const [workoutSplitsNumber, setWorkoutSplitsNumber] = useState(0);
  const [PR, setPR] = useState({});

  // Set username after user is loaded
  useEffect(() => {
    const loadData = async () => {
      if (user && user.username && user.id) {
        setLoading(true);
        try {
          await fetchUserExerciseTracking();
          setUsername(user.username);
          setFirstName(user.name.split(" ")[0]);
          setUserId(user.id);
          setProfileImageUrl(user.profile_image_url);
        } catch (err) {
          console.error("Error fetching exercise tracking:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (exerciseTracking && exerciseTracking.length > 0) {
      setPR(getUserGeneralPR(exerciseTracking));
    }
  }, [exerciseTracking]);

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

  // Get last workout date
  useEffect(() => {
    if (Array.isArray(exerciseTracking) && exerciseTracking.length > 0) {
      setLastWorkoutDate(getUserLastWorkoutDate(exerciseTracking));
    }
  }, [exerciseTracking]);

  // Counter for workouts made
  useEffect(() => {
    const uniWorkouts = new Set();
    if (exerciseTracking && exerciseTracking.length > 0) {
      exerciseTracking.forEach((exerciseInTrackingData) => {
        uniWorkouts.add(exerciseInTrackingData.workoutdate);
      });
      setTotalWorkoutNumber(uniWorkouts.size);
    }
  }, [exerciseTracking]);

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
      mostFrequentSplit: mostFrequentSplit,
      PR: PR ?? null,
    },
    loading,
    error,
  };
};

export default useHomePageLogic;
