import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../api/api";
import {
  loginUser,
  logoutUser,
  refreshAndRotateTokens,
  registerUser,
} from "../services/AuthService";
import { fetchSelfUserData } from "../services/UserService";
import {
  clearRefreshToken,
  getRefreshToken,
  saveRefreshToken,
} from "../utils/tokenStore.js";
import { connectSocket, disconnectSocket } from "../webSockets/socketConfig";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

/**
 * Auth Context
 * -------------
 * Responsibilities:
 * - Hold authentication & session state (user, isLoggedIn, loading flags)
 * - Expose auth actions (register, login, logout)
 * - Handle session bootstrap (checkIfUserSession, initializeUserSession)
 * - DO NOT hold workout/analysis state here (separate contexts handle them)
 */

// Single, app-wide in-memory access token (used by Axios interceptors)
let _accessToken = null;

export const GlobalAuth = {
  getAccessToken: () => _accessToken,
  setAccessToken: (t) => {
    _accessToken = t;
    if (t) {
      api.defaults.headers.common.Authorization = `Bearer ${t}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  },
  logout: null,
};

export const AuthProvider = ({ children }) => {
  // --- Auth & session state ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false); // UI loading for login/register
  const [sessionLoading, setSessionLoading] = useState(true); // App boot/silent refresh
  const [user, setUser] = useState(null);
  const [isWorkoutMode, setIsWorkoutMode] = useState(false); // For start workout

  /**
   * initializeUserSession
   * - Called after we have a valid user + tokens.
   * - Responsible for one-time side effects (e.g., socket connect).
   */
  const initializeUserSession = useCallback(async (userId) => {
    await connectSocket(userId);
  }, []);

  /**
   * checkIfUserSession
   * - Called on mount.
   * - Tries to silently restore session using a refresh token.
   * - On success: sets user, tokens, and runs initializeUserSession.
   */
  const checkIfUserSession = useCallback(async () => {
    setSessionLoading(true);
    try {
      const existingRt = await getRefreshToken();
      if (!existingRt) {
        // No refresh token -> no session
        setIsLoggedIn(false);
        setUser(null);
        GlobalAuth.setAccessToken(null);
        return;
      }

      // Rotate tokens
      const { accessToken: at, refreshToken: rt } =
        await refreshAndRotateTokens();
      await saveRefreshToken(rt);
      GlobalAuth.setAccessToken(at);

      // Fetch self user
      const u = await fetchSelfUserData();
      setIsLoggedIn(true);
      setUser(u.data);

      // Initialize side effects
      await initializeUserSession(u.data.id);
    } finally {
      setSessionLoading(false);
    }
  }, [initializeUserSession]);

  // Run the silent session check at app start
  useEffect(() => {
    checkIfUserSession().catch(() => setSessionLoading(false));
  }, [checkIfUserSession]);

  /**
   * login
   * - Logs in with username/password.
   * - Saves refresh token, sets access token, sets user, runs initializeUserSession.
   */
  const login = useCallback(
    async (username, password) => {
      setLoading(true);
      try {
        const res = await loginUser(username, password);
        const { accessToken: at, refreshToken: rt, user: u } = res.data;

        await saveRefreshToken(rt);
        GlobalAuth.setAccessToken(at);

        setIsLoggedIn(true);
        setUser(u);

        await initializeUserSession(u.id);
      } finally {
        setLoading(false);
      }
    },
    [initializeUserSession]
  );

  /**
   * register
   * - Registers a new user, then logs in.
   */
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

  /**
   * logout
   * - Server-side logout attempt (best-effort)
   * - Always clears local session (tokens, user, sockets)
   * - Workout/Analysis providers will observe user=null and reset themselves
   */
  const logout = useCallback(async () => {
    try {
      await logoutUser(); // best-effort
    } catch (err) {
      // Log but do not block local cleanup
      console.log(err?.response?.data || err.message);
    } finally {
      try {
        disconnectSocket();
      } catch {}
      GlobalAuth.logout;
      await clearRefreshToken();
      setIsLoggedIn(false);
      setUser(null);
      setIsWorkoutMode(false);
    }
  }, []);

  // Expose the real logout to axios interceptors via GlobalAuth.logout
  useEffect(() => {
    GlobalAuth.logout = logout;
    return () => {
      GlobalAuth.logout = null;
    };
  }, [logout]);

  // Memoized context value
  const value = useMemo(
    () => ({
      // state
      isLoggedIn,
      user,
      loading,
      sessionLoading,
      // actions
      register,
      login,
      logout,
      // init fns (exposed for bootstrappers if needed)
      initial: {
        checkIfUserSession,
        initializeUserSession,
      },
      isWorkoutMode,
      setIsWorkoutMode,
    }),
    [
      isLoggedIn,
      user,
      loading,
      sessionLoading,
      register,
      login,
      logout,
      checkIfUserSession,
      initializeUserSession,
      isWorkoutMode,
      setIsWorkoutMode,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
