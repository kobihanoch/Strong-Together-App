import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/AuthService";
import { getUserData } from "../services/UserService";
import supabase from "../src/supabaseClient";
import * as Updates from "expo-updates";
import { getUserExerciseTracking } from "../services/WorkoutService";
import { hasWorkoutForToday } from "../utils/authUtils";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

let authListener = null;

export const AuthProvider = ({ children, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(null);

  // Sessions and fetch user
  useEffect(() => {
    const checkIfUserSession = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (session) {
          console.log("Session exists");
          // Get user data for user found
          const userData = await getUserData(session.user.id);

          // Get the exercise tracking for user
          const exerciseTracking = await getUserExerciseTracking(
            session.user.id
          );

          // Check if user trained today
          setHasTrainedToday(hasWorkoutForToday(exerciseTracking));

          // NEW - CHECKS INBOX - FOR NOW ONLY EXAMPLE OF 1 MESSAGE >>>>>>>>>>>>>>
          setUnreadMessages(1); // => In the future will contain an object of messages

          // Update states
          setIsLoggedIn(true);
          setUser(userData);
        } else {
          console.log("Session doesn't exist");
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

    checkIfUserSession();
  }, []);

  // Load profile pic
  const updateProfilePic = (picUrl) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, profile_image_url: picUrl };
      AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const register = async (email, password, username, fullName, gender) => {
    const result = await registerUser(
      email,
      password,
      username,
      fullName,
      gender
    );

    if (!result.success) {
      console.log(result.reason);
    }

    await login(username, password);
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      const result = await loginUser(username, password);
      if (!result.success) {
        throw new Error(result.reason);
      }
      const user = result.user;
      setIsLoggedIn(true);
      setUser(user);
      console.log("✅ Login successful - waiting for onAuthStateChange...");
    } catch (err) {
      console.log("Error logging in: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    //await Updates.reloadAsync();
    //await AsyncStorage.clear();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        register,
        login,
        logout,
        updateProfilePic,
        loading,
        setHasTrainedToday,
        hasTrainedToday,
        notifications: {
          unreadMessages,
          setUnreadMessages,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
