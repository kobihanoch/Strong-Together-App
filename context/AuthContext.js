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
  cacheDeleteAllCache,
  cacheGetJSON,
  cacheSetJSON,
  keyAuth,
  TTL_48H,
} from "../cache/cacheUtils";
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
import { useGlobalAppLoadingContext } from "./GlobalAppLoadingContext";

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
  // Global loading
  const { setLoading: setGlobalLoading } = useGlobalAppLoadingContext();

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
      const {
        accessToken: at,
        refreshToken: rt,
        userId,
      } = await refreshAndRotateTokens();
      await saveRefreshToken(rt);
      GlobalAuth.setAccessToken(at);

      // Check for front cache
      const authKey = keyAuth(userId);
      const cached = await cacheGetJSON(authKey);
      if (cached) {
        setIsLoggedIn(true);
        setUser(cached);
        console.log("User cached!");
        await initializeUserSession(userId);
        return;
      }

      // Fetch self user - API call
      const u = await fetchSelfUserData();
      setIsLoggedIn(true);
      setUser(u.data);

      // Store in cache
      await cacheSetJSON(authKey, u.data, TTL_48H);

      // Initialize side effects
      await initializeUserSession(u.data.id);
    } finally {
      setSessionLoading(false);
    }
  }, [initializeUserSession]);

  // Report auth session loading to global loading
  useEffect(() => {
    setGlobalLoading("auth", sessionLoading);
    return () => setGlobalLoading("auth", false); // ensure cleanup on unmount
  }, [sessionLoading]);

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

        // Store in cache
        const authKey = keyAuth(u.id);
        await cacheSetJSON(authKey, u, TTL_48H);

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
      await cacheDeleteAllCache();
      _accessToken = null;
      setIsLoggedIn(false);
      setLoading(false);
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
