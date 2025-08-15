import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import api from "../api/api";
import {
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
import { extractWorkoutSplits, splitTheWorkout } from "../utils/sharedUtils";
import {
  clearRefreshToken,
  getRefreshToken,
  saveRefreshToken,
} from "../utils/tokenStore.js";
import { connectSocket, disconnectSocket } from "../webSockets/socketConfig";
import { fetchSelfUserData } from "../services/UserService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/**
 * Auth Context Value Flow:
 * - Authentication state: isLoggedIn, user, loading flags
 * - Auth actions: register, login, logout
 * - Session init functions: checkIfUserSession, initializeUserSession
 * - Workout state & tracking data
 * - Workout mode state
 */

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

export const AuthProvider = ({ children }) => {
  // ---------------- STATE ----------------
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

  // ---------------- GLOBAL CALLBACKS INIT ----------------
  // Expose global setters for use outside React tree (e.g., API interceptors)
  useEffect(() => {
    GlobalAuth.setUser = setUser;
    GlobalAuth.setIsLoggedIn = setIsLoggedIn;
    GlobalAuth.logout = async () => {
      // Disconnect WS + clear all state + remove tokens
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

  // ---------------- SESSION CHECK ----------------
  // On mount → check if user session exists via refresh token
  const initializeUserSession = useCallback(async (userId) => {
    // Step 1: Connect socket
    // Step 2: Load workout data
    // Step 3: Load exercise tracking data
    setSessionLoading(true);
    try {
      await connectSocket(userId);

      /*if (exerciseTrackingData) {
        setExerciseTracking(exerciseTrackingData.exercisetracking);
        setAnalyzedExerciseTrackingData(
          unpackFromExerciseTrackingData(exerciseTrackingData)
        );
        setHasTrainedToday(exerciseTrackingData.hasTrainedToday);
      }*/
    } finally {
      setSessionLoading(false);
    }
  }, []);

  const checkIfUserSession = useCallback(async () => {
    // Step 1: Look for refresh token
    // Step 2: Rotate tokens if exists
    // Step 3: Load user data
    // Step 4: Initialize session (workout, tracking, sockets)
    setSessionLoading(true);
    try {
      const existingRt = await getRefreshToken();
      if (!existingRt) {
        setIsLoggedIn(false);
        return;
      }
      const { accessToken: at, refreshToken: rt } =
        await refreshAndRotateTokens();
      await saveRefreshToken(rt);
      GlobalAuth.setAccessToken(at);

      const u = await fetchSelfUserData();
      setIsLoggedIn(true);
      setUser(u.data);

      await initializeUserSession(u.data.id);
    } finally {
      setSessionLoading(false);
    }
  }, [initializeUserSession]);

  // ---------------- AUTH ACTIONS ----------------

  const login = useCallback(
    async (username, password) => {
      setLoading(true);
      try {
        const userData = await loginUser(username, password);
        const { accessToken: at, refreshToken: rt } = userData.data;
        await saveRefreshToken(rt);
        GlobalAuth.setAccessToken(at);

        setIsLoggedIn(true);
        setUser(userData.data.user);
        await initializeUserSession(userData.data.user.id);
      } finally {
        setLoading(false);
      }
    },
    [initializeUserSession]
  );

  const register = useCallback(
    async (email, password, username, fullName, gender) => {
      setLoading(true);
      try {
        await registerUser(email, password, username, fullName, gender);
        await login(username, password);
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log(err?.response?.data || err.message);
    } finally {
      if (GlobalAuth.logout) await GlobalAuth.logout();
    }
  }, []);

  // ---------------- INITIAL SESSION LOAD ----------------
  useEffect(() => {
    checkIfUserSession().catch(() => setSessionLoading(false));
  }, [checkIfUserSession]);

  // ---------------- CONTEXT VALUE (MEMOIZED) ----------------
  const value = useMemo(
    () => ({
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
    }),
    [
      isLoggedIn,
      user,
      register,
      login,
      logout,
      loading,
      sessionLoading,
      hasTrainedToday,
      checkIfUserSession,
      initializeUserSession,
      workout,
      workoutSplits,
      exercises,
      exerciseTracking,
      analyzedExerciseTrackingData,
      isWorkoutMode,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
