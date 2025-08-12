import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
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
import { unpackFromExerciseTrackingData } from "../utils/authUtils";
import { splitTheWorkout } from "../utils/sharedUtils";
import {
  clearRefreshToken,
  getRefreshToken,
  saveRefreshToken,
} from "../utils/tokenStore.js";
import { connectSocket, disconnectSocket } from "../src/socket";

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
  const [sessionLoading, setSessionLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [workoutSplits, setWorkoutSplits] = useState(null);
  const [exercises, setExercises] = useState(null);
  const [exerciseTracking, setExerciseTracking] = useState(null);
  const [analyzedExerciseTrackingData, setAnalyzedExerciseTrackingData] =
    useState(null);

  const [isWorkoutMode, setIsWorkoutMode] = useState(false);

  // Expose global callbacks once (do not depend on accessToken to avoid resetting closures).
  useEffect(() => {
    GlobalAuth.setUser = setUser;
    GlobalAuth.setIsLoggedIn = setIsLoggedIn;
    GlobalAuth.logout = async () => {
      disconnectSocket();
      setLoading(false);
      setSessionLoading(false);
      setIsLoggedIn(false);
      setUser(null);
      setWorkout(null);
      setWorkoutSplits(null);
      setExercises(null);
      setExerciseTracking(null);
      setHasTrainedToday(null);
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

  // On app start: rotate tokens via checkAuth and only then load data.
  // Restore session on provider mount BEFORE children render critical stuff
  useEffect(() => {
    checkIfUserSession().catch(() => setSessionLoading(false));
  }, []);

  const checkIfUserSession = async () => {
    setSessionLoading(true);
    try {
      // First check if there any refresh token stored
      const existingRt = await getRefreshToken();
      if (!existingRt) {
        // no token => no refresh call
        setIsLoggedIn(false);
        return;
      }
      const { accessToken: at, refreshToken: rt } =
        await refreshAndRotateTokens(); // server rotates both tokens here

      // Persist refresh first, then update in-memory and state access.
      await saveRefreshToken(rt);
      GlobalAuth.setAccessToken(at);

      const u = await fetchSelfUserData();
      setIsLoggedIn(true);
      setUser(u.data);

      await initializeUserSession(u.data.id);
    } catch (err) {
    } finally {
      setSessionLoading(false);
    }
  };

  // After checking authentication, load all user's workouts data
  const initializeUserSession = async (userId) => {
    setSessionLoading(true);
    try {
      await connectSocket(userId);
      const userWorkoutData = await getUserWorkout();
      const exerciseTrackingData = await getUserExerciseTracking();
      const {
        workout: wData,
        workoutSplits: sData,
        exercises: eData,
      } = splitTheWorkout(userWorkoutData?.data);

      // Set user workout
      if (userWorkoutData) {
        setWorkout(wData);
        setWorkoutSplits(sData);
        setExercises(eData);
      }
      // Set exercisetracking and analysis
      if (exerciseTrackingData) {
        setExerciseTracking(exerciseTrackingData.exercisetracking);
        // All home page data
        setAnalyzedExerciseTrackingData(
          unpackFromExerciseTrackingData(exerciseTrackingData)
        );
        setHasTrainedToday(exerciseTrackingData.hasTrainedToday);
      }
    } finally {
      setSessionLoading(false);
    }
  };

  const register = async (email, password, username, fullName, gender) => {
    setLoading(true);
    try {
      await registerUser(email, password, username, fullName, gender);
      await login(username, password);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const userData = await loginUser(username, password);

      const { accessToken: at, refreshToken: rt } = userData.data;
      await saveRefreshToken(rt);
      GlobalAuth.setAccessToken(at);

      setIsLoggedIn(true);
      setUser(userData.data.user);

      await initializeUserSession(userData.data.user.id);
    } catch (err) {
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
        setUser,
        register,
        login,
        logout,
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
          analyzedExerciseTrackingData,
        },
        isWorkoutMode,
        setIsWorkoutMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
