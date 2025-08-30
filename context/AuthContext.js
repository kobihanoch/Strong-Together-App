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
import useCacheAndFetch from "../hooks/useCacheAndFetch";
import useUpdateGlobalLoading from "../hooks/useUpdateGlobalLoading";
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
  const [userIdCache, setUserIdCache] = useState(null);

  // --- Auth & session state ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false); // UI loading for login/register
  const [user, setUser] = useState(null);
  const [isWorkoutMode, setIsWorkoutMode] = useState(false); // For start workout

  const [authPhase, setAuthPhase] = useState("checking");

  // Flag for below contexes for fetching with API
  const [isValidatedWithServer, setIsValidatedWithServer] = useState(false);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await fetchSelfUserData(), []);

  // On data function
  const onDataFn = useCallback((u) => {
    setUser(u);
  }, []);

  // Hook usage
  const { loading: userDataLoading } = useCacheAndFetch(
    { id: userIdCache }, // user prop
    keyAuth, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    user, // cache payload
    "Auth Context" // log
  );

  // Report auth session loading to global loading
  useUpdateGlobalLoading("Auth", userDataLoading);

  /**
   * initializeUserSession
   * - Called after we have a valid user + tokens.
   * - Responsible for one-time side effects (e.g., socket connect).
   */
  const initializeUserSession = useCallback(async (userId) => {
    await connectSocket(userId);
  }, []);

  // Inital check
  useEffect(() => {
    (async () => {
      // If a prev session => get user id and store it in state
      // At this point an auth key is building and automatically trying to fetch user data from cache
      // Auto start belows useEffect
      setAuthPhase("checking");
      const cacheUserId = await cacheGetJSON("CACHE:USER_ID");
      const existingRt = await getRefreshToken();
      if (!existingRt || !cacheUserId) {
        // No refresh token -> no session => stay logged out and auto renavifate to auth stack
        console.log(
          "\x1b[31m[Auth Context]: No latest user => Login is required\x1b[0m"
        );
        setIsLoggedIn(false);
        setUser(null);
        setUserIdCache(null);
        GlobalAuth.setAccessToken(null);
        setAuthPhase("guest");
        return;
      }
      setIsLoggedIn(true);
      setUserIdCache(cacheUserId);
      setAuthPhase("authed");

      // Try to validate with server
      try {
        // Check if user is cached
        // Initialize session tokens
        const {
          accessToken: at,
          refreshToken: rt,
          userId,
        } = await refreshAndRotateTokens();
        await saveRefreshToken(rt);
        GlobalAuth.setAccessToken(at);
        // For other contexes to start fetching from API after cache
        setIsValidatedWithServer(true);
        console.log(
          "\x1b[32m[Auth Context]: Validation with server completed => Fetching data from API\x1b[0m"
        );

        // Save for later use
        await cacheSetJSON("CACHE:USER_ID", userId, TTL_48H);
        // Store in cache (auto)
      } catch (e) {
        console.log(
          "\x1b[31m[Auth Context]: Validation with server failed => Logging out\x1b[0m"
        );
        await clearRefreshToken();
        await cacheDeleteAllCache();
        _accessToken = null;
        setIsLoggedIn(false);
        setLoading(false);
        setUser(null);
        setIsWorkoutMode(false);
        setUserIdCache(null);
        setIsValidatedWithServer(false);
        setAuthPhase("guest");
      }
    })();
  }, []);

  // Connect socket only after server validates
  useEffect(() => {
    if (isValidatedWithServer && user?.id) {
      initializeUserSession(user.id);
    }
  }, [isValidatedWithServer, user?.id, initializeUserSession]);

  /**
   * login
   * - Logs in with username/password.
   * - Saves refresh token, sets access token, sets user, runs initializeUserSession.
   */
  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const {
        accessToken: at,
        refreshToken: rt,
        user: u,
      } = await loginUser(username, password);
      await saveRefreshToken(rt);
      GlobalAuth.setAccessToken(at);

      // Start cache hook logic
      // User is fetched from server by cache hook
      console.log("Still loading in context => is logged in true");

      setIsLoggedIn(true);
      setUserIdCache(u.id);
      setIsValidatedWithServer(true);
      setAuthPhase("authed");

      // Save for later entrance
      await cacheSetJSON("CACHE:USER_ID", u.id, TTL_48H);
      // For other contexes to start fetching from API after cache
      console.log("\x1b[32m[Auth Context]: Login succeeded!\x1b[0m");

      // Cache stores auto
    } finally {
      setLoading(false);
    }
  }, []);

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
      setIsLoggedIn(false);
      setUser(null);
      await logoutUser(); // best-effort
    } catch (err) {
      // Log but do not block local cleanup
      console.log(err?.response?.data || err.message);
    } finally {
      try {
        disconnectSocket();
      } catch {}
      await clearRefreshToken();
      await cacheDeleteAllCache();
      _accessToken = null;
      setIsLoggedIn(false);
      setLoading(false);
      setUser(null);
      setIsWorkoutMode(false);
      setUserIdCache(null);
      setIsValidatedWithServer(false);
      setAuthPhase("guest");
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
      authPhase,
      isLoggedIn,
      user,
      setUser,
      loading,
      userDataLoading,
      // actions
      register,
      login,
      logout,
      // init fns (exposed for bootstrappers if needed)
      initial: {
        initializeUserSession,
      },
      isWorkoutMode,
      setIsWorkoutMode,
      isValidatedWithServer,
    }),
    [
      isLoggedIn,
      user,
      setUser,
      loading,
      userDataLoading,
      register,
      login,
      logout,
      initializeUserSession,
      isWorkoutMode,
      setIsWorkoutMode,
      isValidatedWithServer,
      authPhase,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
