import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  updateProfilePictureURL,
  getUserData,
  getUsername,
} from "../services/UserService";

export const useUserData = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState(null);

  const updateProfilePictureURLForUser = async (userId, picURL) => {
    try {
      setLoading(true);
      await updateProfilePictureURL(userId, picURL);
    } catch (err) {
      console.log("Hook error: " + err);
      setError(err);
      throw err;
    } finally {
      console.log("Hook: susccessfully updated profile pic");
      setLoading(false);
    }
  };

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      const userData = await getUserData(userId);
      setUserData(userData);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserNameByUserId = async (userId) => {
    setLoading(true);
    try {
      const userData = await getUsername(userId);
      setUsername(userData.username);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserNameByUserId(userId);
  }, [userId]);

  return {
    updateProfilePictureURLForUser,
    fetchUserData,
    username,
    userData,
    error,
    loading,
  };
};

export default useUserData;
