import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  fetchSelfUserData,
  loginUser,
  logoutUser,
  refreshAndRotateTokens,
  registerUser,
} from "../services/AuthService";
import {
  getUserExerciseTracking,
  getUserWorkout,
} from "../services/WorkoutService";
import { hasWorkoutForToday } from "../utils/authUtils";
import { splitTheWorkout } from "../utils/sharedUtils";
import { clearRefreshToken, saveRefreshToken } from "../utils/tokenStore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Single source of truth for access token across app and interceptors.
let _accessToken = null;

export const GlobalAuth = {
  getAccessToken: () => _accessToken,
  setAccessToken: (t) => {
    _accessToken = t;
  },
  setUser: null,
  setIsLoggedIn: null,
  logout: null,
};

export const AuthProvider = ({ children, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [workoutSplits, setWorkoutSplits] = useState(null);
  const [exercises, setExercises] = useState(null);
  const [exerciseTracking, setExerciseTracking] = useState(null);

  const [isWorkoutMode, setIsWorkoutMode] = useState(false);

  // Expose global callbacks once (do not depend on accessToken to avoid resetting closures).
  useEffect(() => {
    GlobalAuth.setUser = setUser;
    GlobalAuth.setIsLoggedIn = setIsLoggedIn;
    GlobalAuth.logout = async () => {
      setLoading(false);
      setSessionLoading(false);
      setIsLoggedIn(false);
      setUser(null);
      setWorkout(null);
      setWorkoutSplits(null);
      setExercises(null);
      setExerciseTracking(null);
      setHasTrainedToday(hasWorkoutForToday(null));
      setIsWorkoutMode(false);
      GlobalAuth.setAccessToken(null);
      api.defaults.headers.common.Authorization = undefined;

      await clearRefreshToken();
    };

    return () => {
      GlobalAuth.setUser = null;
      GlobalAuth.setIsLoggedIn = null;
      GlobalAuth.logout = null;
    };
  }, []);

  const initializeUserSession = async () => {
    setSessionLoading(true);
    try {
      const userWorkoutData = await getUserWorkout();
      const exerciseTrackingData = await getUserExerciseTracking();
      const {
        workout: wData,
        workoutSplits: sData,
        exercises: eData,
      } = splitTheWorkout(userWorkoutData?.data);

      if (userWorkoutData) {
        setWorkout(wData);
        setWorkoutSplits(sData);
        setExercises(eData);
      }
      if (exerciseTrackingData) {
        setExerciseTracking(exerciseTrackingData.data);
        setHasTrainedToday(hasWorkoutForToday(exerciseTrackingData.data));
      }
    } finally {
      setSessionLoading(false);
    }
  };

  // On app start: rotate tokens via checkAuth and only then load data.
  const checkIfUserSession = async () => {
    setSessionLoading(true);
    try {
      const { accessToken: at, refreshToken: rt } =
        await refreshAndRotateTokens(); // server rotates both tokens here

      // Persist refresh first, then update in-memory and state access.
      await saveRefreshToken(rt);
      GlobalAuth.setAccessToken(at);

      const u = await fetchSelfUserData();
      setIsLoggedIn(true);
      setUser(u.data);

      await initializeUserSession();
    } catch (err) {
      throw err;
    } finally {
      setSessionLoading(false);
    }
  };

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
      if (result?.success) {
        await login(username, password);
      } else {
        console.log(result?.reason);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const userData = await loginUser(username, password);
      setIsLoggedIn(true);
      setUser(userData.data.user);

      const { accessToken: at, refreshToken: rt } = userData.data;
      await saveRefreshToken(rt);
      GlobalAuth.setAccessToken(at);

      await initializeUserSession();
    } catch (err) {
      console.log(err?.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log(err?.response?.data || err.message);
    } finally {
      if (GlobalAuth.logout) await GlobalAuth.logout();
    }
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
