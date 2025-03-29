import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useUserWorkout } from "../useUserWorkout";
import React from "react";

const useHomePageLogic = (user) => {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const { refetch, userWorkout, loading, error } = useUserWorkout(user?.id);
  const [hasAssignedWorkout, setHasAssignedWorkout] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // Set username after user is laoded
  useEffect(() => {
    console.log("User is:  " + JSON.stringify(user));
    if (user && user.username && user.id) {
      setUsername(user.username);
      setUserId(user.id);
      setProfileImageUrl(user.profile_image_url);
    }
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
    if (userWorkout && userWorkout.length > 0) {
      setHasAssignedWorkout(true);
    } else {
      setHasAssignedWorkout(false);
    }
  }, [userWorkout]);

  return {
    username,
    userId,
    hasAssignedWorkout,
    profileImageUrl,
    loading,
    error,
  };
};

export default useHomePageLogic;
