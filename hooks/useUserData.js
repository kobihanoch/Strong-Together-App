import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfilePictureURL } from "../services/UserService";

export const useUserData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return { updateProfilePictureURLForUser, error, loading };
};

export default useUserData;
