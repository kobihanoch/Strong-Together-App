import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/AuthService";
import { getUserData, getUserMessages } from "../services/UserService";
import supabase from "../src/supabaseClient";
import * as Updates from "expo-updates";
import { getUserExerciseTracking } from "../services/WorkoutService";
import { hasWorkoutForToday, filterMessagesByUnread } from "../utils/authUtils";
import { NotificationsContext } from "./NotificationsContext";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

let authListener = null;

export const AuthProvider = ({ children, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);

  // Method for initializaztion
  const initializeUserSession = async (sessionUserId) => {
    const userData = await getUserData(sessionUserId);
    const exerciseTracking = await getUserExerciseTracking(sessionUserId);

    console.log("Userdata: ", userData);

    setUser(userData);
    setHasTrainedToday(hasWorkoutForToday(exerciseTracking));

    // Logged in state for navigating
    setIsLoggedIn(true);
  };

  // Sessions and fetch user
  const checkIfUserSession = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        console.log("Session exists");
        await initializeUserSession(session.user.id);
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

  // Refresh token auto
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed: ", event);
        if (event === "TOKEN_REFRESHED") {
          await initializeUserSession(session.user.id);
        } else if (event === "USER_DELETED" || event === "SIGNED_OUT") {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    );

    authListener = listener;

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
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
    setLoading(true);
    try {
      const result = await registerUser(
        email,
        password,
        username,
        fullName,
        gender
      );

      if (!result.success) {
        console.log(result.reason);
      } else {
        await login(username, password);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      // Will throw on network, parse, or invalid creds
      const { user, session } = await loginUser(username, password);

      // Save session in Supabase SDK
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      // Initialize user context
      await initializeUserSession(user.id);
      console.log("✅ Login successful");
    } catch (err) {
      console.log("Error logging in:", err.message);
      // Rethrow so the calling UI can catch and display an alert
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    setHasTrainedToday(false);
    await AsyncStorage.clear();
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
        initial: {
          checkIfUserSession,
          initializeUserSession,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
