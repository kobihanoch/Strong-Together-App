import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/AuthService";
import { getUserData } from "../services/UserService";
import {
  getUserExerciseTracking,
  getUserWorkout,
} from "../services/WorkoutService";
import supabase from "../src/supabaseClient";
import { hasWorkoutForToday } from "../utils/authUtils";
import { splitTheWorkout } from "../utils/sharedUtils";
import { clearRefreshToken, saveRefreshToken } from "../utils/tokenStore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

let authListener = null;
export const GlobalAuth = {
  setUser: null,
  setIsLoggedIn: null,
  logout: null,
};

export const AuthProvider = ({ children, onLogout }) => {
  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // User data
  const [user, setUser] = useState(null);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [workoutSplits, setWorkoutSplits] = useState(null);
  const [exercises, setExercises] = useState(null);
  const [exerciseTracking, setExerciseTracking] = useState(null);

  // Modes
  const [isWorkoutMode, setIsWorkoutMode] = useState(false);

  useEffect(() => {
    console.log("is workout mode? ", isWorkoutMode);
  }, [isWorkoutMode]);

  // -------------------------------------------------------------------------------
  // Export global auth
  useEffect(() => {
    GlobalAuth.setUser = setUser;
    GlobalAuth.accessToken = accessToken;
    GlobalAuth.setIsLoggedIn = setIsLoggedIn;
    GlobalAuth.logout = async () => {
      setIsLoggedIn(false);
      setUser(null);
      setWorkout(null);
      setWorkoutSplits(null);
      setExercises(null);
      setExerciseTracking(null);
      setHasTrainedToday(hasWorkoutForToday(null));
      setIsWorkoutMode(false);

      await AsyncStorage.clear();
      await supabase.auth.signOut();
    };

    return () => {
      GlobalAuth.setUser = null;
      GlobalAuth.setIsLoggedIn = null;
      GlobalAuth.logout = null;
    };
  }, []);

  // Method for initializaztion
  const initializeUserSession = async (sessionUserId) => {
    setSessionLoading(true);
    try {
      // Fetch data
      const userData = await getUserData(sessionUserId);
      const userWorkoutData = await getUserWorkout(sessionUserId);
      const exerciseTrackingData = await getUserExerciseTracking(sessionUserId);
      const {
        workout: wData,
        workoutSplits: sData,
        exercises: eData,
      } = splitTheWorkout(userWorkoutData);

      // Assign to states
      setUser(userData);
      if (userWorkoutData) {
        // Workout
        setWorkout(wData);
        setWorkoutSplits(sData);
        setExercises(eData);
      }
      if (exerciseTrackingData) {
        // Tracking
        setExerciseTracking(exerciseTrackingData);
        setHasTrainedToday(hasWorkoutForToday(exerciseTrackingData));
      }

      // Logged in state for navigating
      setIsLoggedIn(true);
    } catch (e) {
      throw e;
    } finally {
      setSessionLoading(false);
    }
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
        if (event === "USER_DELETED" || event === "SIGNED_OUT") {
          clearStates();
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
      const userData = await loginUser(username, password);
      setIsLoggedIn(true);
      setUser(userData.data.user);
      const { accessToken: resAT, refreshToken: resRT } = userData.data;
      setAccessToken(resAT);
      saveRefreshToken(resRT);
      // Need to add fetch data
    } catch (err) {
      console.log(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const userData = await logoutUser();
      // Need to add fetch data
    } catch (err) {
      console.log(err.response.data);
    } finally {
      clearStates();
      setLoading(false);
    }
  };

  const clearStates = () => {
    // Clear older data
    setIsLoggedIn(false);
    setUser(null);
    setWorkout(null);
    setWorkoutSplits(null);
    setExercises(null);
    setExerciseTracking(null);
    setHasTrainedToday(hasWorkoutForToday(null));
    setIsWorkoutMode(false);
    setAccessToken(null);
    clearRefreshToken();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        accessToken,
        setAccessToken,
        register,
        login,
        logout,
        updateProfilePic,
        loading,
        sessionLoading,
        setHasTrainedToday,
        hasTrainedToday,
        initial: {
          checkIfUserSession,
          initializeUserSession,
        },
        workout: {
          workout,
          setWorkout,
          workoutSplits,
          setWorkoutSplits,
          exercises,
          setExercises,
          exerciseTracking,
          setExerciseTracking,
        },
        isWorkoutMode,
        setIsWorkoutMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
