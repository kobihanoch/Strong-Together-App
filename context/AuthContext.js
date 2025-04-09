import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/AuthService";
import { getUserData, getUserMessages } from "../services/UserService";
import supabase from "../src/supabaseClient";
import * as Updates from "expo-updates";
import { getUserExerciseTracking } from "../services/WorkoutService";
import { hasWorkoutForToday, filterMessagesByUnread } from "../utils/authUtils";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

let authListener = null;

export const AuthProvider = ({ children, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [allReceivedMessages, setAllReceivedMessages] = useState(null);

  // Method for initializaztion
  const initializeUserSession = async (sessionUserId) => {
    const userData = await getUserData(sessionUserId);
    const exerciseTracking = await getUserExerciseTracking(sessionUserId);
    const messages = await getUserMessages(sessionUserId);

    setUser(userData);
    setHasTrainedToday(hasWorkoutForToday(exerciseTracking));

    // Messages
    setAllReceivedMessages(messages);
    setUnreadMessages(filterMessagesByUnread(messages), null, 2);

    // Logged in state for navigating
    setIsLoggedIn(true);
  };

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
          initializeUserSession(session.user.id);
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
      initializeUserSession(result.user.id);
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
          allReceivedMessages,
          setAllReceivedMessages,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
