import { registerUser, loginUser, logoutUser } from "../services/AuthService";
import React, { useState } from "react";

const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      setError(null);
      setSuccess(false);
      setLoading(true);
      const result = await loginUser(username, password);
      if (result.success) {
        setUser = result.user;
        setSuccess(true);
      } else {
        setSuccess(false);
        setError(result.reason);
      }
    } catch (err) {
      console.log("Hook error: " + err);
      setError(err);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login };
};

export default useAuthActions;
