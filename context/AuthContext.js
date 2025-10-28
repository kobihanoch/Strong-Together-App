import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { hasBootstrapPayload, resetBootstrap } from "../api/bootstrapApi";
import {
  cacheDeleteAllCache,
  cacheDeleteAllCacheWithoutStartWorkout,
  cacheGetJSON,
  cacheSetJSON,
  keyAuth,
  TTL_48H,
} from "../cache/cacheUtils";
import { showErrorAlert } from "../errors/errorAlerts";
import { useAppleAuth } from "../hooks/oAuth/useAppleAuth";
import { useGoogleAuth } from "../hooks/oAuth/useGoogleAuth";
import useCacheAndFetch from "../hooks/useCacheAndFetch";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import useUpdateGlobalLoading from "../hooks/useUpdateGlobalLoading";
import {
  loginUser,
  logoutUser,
  refreshAndRotateTokens,
  registerUser,
} from "../services/AuthService";
import { loginOAuthWithAccessToken } from "../services/OAuthService";
import { fetchSelfUserData } from "../services/UserService";
import GlobalAuth from "../utils/authUtils";
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

export const AuthProvider = ({ children }) => {
  // --- Caching state - if stored so start load cached user data ---
  const [userIdCache, setUserIdCache] = useState(null);

  // --- Auth & session state ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false); // UI loading for login/register
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isWorkoutMode, setIsWorkoutMode] = useState(false); // For start workout

  // --- For fluint loading at startup with no blinks ---
  const [authPhase, setAuthPhase] = useState("checking");

  // --- Offline mode supportings ---
  const isOnline = useNetworkStatus();
  const attemptedServerValidationRef = useRef(false);
  const serverValidatingLockRef = useRef(false);

  // --- OAuth ---
  const { signInWithGoogle } = useGoogleAuth();
  const { signInWithApple } = useAppleAuth();

  // --- Flag for below contexes for fetching with API ---
  const [isValidatedWithServer, setIsValidatedWithServer] = useState(false);

  // -------------------------- useCacheHandler props ------------------------------

  // Fetch function
  const fetchFn = useCallback(async () => await fetchSelfUserData(), []);

  // On data function
  const onDataFn = useCallback((u) => {
    setUser(u);
  }, []);

  // Hook usage
  const { loading: userDataLoading, cacheKnown } = useCacheAndFetch(
    { id: userIdCache }, // user prop
    keyAuth, // key builder
    isValidatedWithServer, // flag from server
    fetchFn, // fetch cb
    onDataFn, // on data cb
    user, // cache payload
    "Auth Context" // log
  );

  // Report auth session loading to global loading
  useUpdateGlobalLoading(
    "Auth",
    cacheKnown ? userDataLoading : hasBootstrapPayload()
  );

  useEffect(() => {
    if (user?.username) GlobalAuth.setUsernameInHeader(user?.username);
  }, [user]);

  /**
   * initializeUserSession
   * - Called after we have a valid user + tokens.
   * - Responsible for one-time side effects (e.g., socket connect).
   */
  const initializeUserSession = useCallback(async (username) => {
    await connectSocket(username);
  }, []);

  // Attempting server validation fuction
  const attemptServerValidation = useCallback(async () => {
    try {
      // Check if user is cached
      // Initialize session tokens
      // Avoid multiple calls on unstable network
      if (serverValidatingLockRef.current) return;
      serverValidatingLockRef.current = true;
      //await new Promise((res) => setTimeout(res, 3000)); // wait 3 seconds
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
      //Alert.alert("Validation completed!");
      // Store in cache (auto)
    } catch (e) {
      if (e.isUpgradeRequired) {
        console.log(
          "\x1b[31m[Auth Context]: Upgrade required. Modal is up.\x1b[0m"
        );
        setIsValidatedWithServer(false);
        return;
      }
      if (e.isNetworkError) {
        console.log(
          "\x1b[33m[Auth Context]: Server validation skipped (offline). Staying logged-in with cached data.\x1b[0m"
        );
        setIsValidatedWithServer(false);
        return;
      }
      if (e.isServerError) {
        console.log(
          "\x1b[33m[Auth Context]: Server validation skipped (offline). Staying logged-in with cached data.\x1b[0m"
        );
        setIsValidatedWithServer(false);
        return;
      }
      console.log(
        "\x1b[31m[Auth Context]: Validation with server failed => Logging out\x1b[0m"
      );
      await clearContext();
    } finally {
      attemptedServerValidationRef.current = true;
      serverValidatingLockRef.current = false;
    }
  }, [clearContext]);

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
        await clearContext();
        return;
      }
      // Triggers SWR hook logic chain
      setUserIdCache(cacheUserId);
      setIsLoggedIn(true);
      setAuthPhase("authed");

      // Try to validate with server
      // Silent background validation with server (if there was a previuos session)
      await attemptServerValidation();
    })();
  }, [clearContext]);

  // If starting in offline mode - fetch later
  useEffect(() => {
    (async () => {
      if (
        !isValidatedWithServer &&
        attemptedServerValidationRef.current &&
        isOnline
      ) {
        await attemptServerValidation();
      }
    })();
  }, [isValidatedWithServer, isOnline]);

  // Connect socket only after server validates
  useEffect(() => {
    if (isValidatedWithServer && user?.username) {
      initializeUserSession(user.username);
    }
  }, [isValidatedWithServer, initializeUserSession, user?.username]);

  /**
   * login
   * - Logs in with username/password.
   * - Saves refresh token, sets access token, sets user, runs initializeUserSession.
   */
  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    try {
      const {
        accessToken: at,
        refreshToken: rt,
        user: u,
      } = await loginUser(identifier, password);
      await saveRefreshToken(rt);
      GlobalAuth.setAccessToken(at);

      // Start cache hook logic
      // User is fetched from server by cache hook
      console.log(
        "Redirecting to app stack => is logged in true and data is being fetched"
      );
      setUserIdCache(u);
      setIsLoggedIn(true);

      console.log("\x1b[32m[Auth Context]: Login succeeded!\x1b[0m");
      setIsValidatedWithServer(true);
      setAuthPhase("authed");

      // Save for later entrance
      await cacheSetJSON("CACHE:USER_ID", u, TTL_48H);
      // For other contexes to start fetching from API after cache

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
        //await login(username, password);
        Notifier.showNotification({
          title: "Please verify your account",
          description: `An email has been sent to ${email}`,
          duration: 5000,
          showAnimationDuration: 250,
          hideOnPress: true,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "success", // "success" | "warn" | "error"
            titleStyle: { fontSize: 16 },
            descriptionStyle: { fontSize: 14 },
          },
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * logout
   * - Server-side logout attempt (best-effort)
   * - Always clears local session (tokens, user, sockets)
   * - Workout/Analysis providers will observe user=null and reset themselves
   */
  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setUser(null);
      await cacheDeleteAllCache();
    } catch (err) {
      // Log but do not block local cleanup
      console.log(err?.response?.data || err.message);
    } finally {
      try {
        disconnectSocket();
      } catch {}
      await clearContext();
    }
  }, []);

  const handleGoogleAuth = useCallback(
    async (loginWithAt = false) => {
      setGoogleLoading(true);
      try {
        const {
          accessToken: at,
          refreshToken: rt,
          user: u,
          missingFields,
        } = loginWithAt
          ? await loginOAuthWithAccessToken()
          : await signInWithGoogle();

        // If logged in (no missing fields)
        if (!missingFields) {
          await saveRefreshToken(rt);
          GlobalAuth.setAccessToken(at);

          setIsLoggedIn(true);
          setUserIdCache(u);
          console.log("\x1b[32m[Auth Context]: Login succeeded!\x1b[0m");
          setIsValidatedWithServer(true);
          setAuthPhase("authed");
          await cacheSetJSON("CACHE:USER_ID", u, TTL_48H);
        } else {
          // Missing fields
          GlobalAuth.setAccessToken(at); // To be able to update user fields
          return { missingFields };
        }
      } catch (e) {
        showErrorAlert("Error signing in with Google", e.message);
      } finally {
        setGoogleLoading(false);
      }
    },
    [signInWithGoogle]
  );

  const handleAppleAuth = useCallback(
    async (loginWithAt = false) => {
      setAppleLoading(true);
      try {
        const {
          accessToken: at,
          refreshToken: rt,
          user: u,
          missingFields,
        } = loginWithAt
          ? await loginOAuthWithAccessToken()
          : await signInWithApple();

        // If logged in (no missing fields)
        if (!missingFields) {
          await saveRefreshToken(rt);
          GlobalAuth.setAccessToken(at);

          setIsLoggedIn(true);
          setUserIdCache(u);
          console.log("\x1b[32m[Auth Context]: Login succeeded!\x1b[0m");
          setIsValidatedWithServer(true);
          setAuthPhase("authed");
          await cacheSetJSON("CACHE:USER_ID", u, TTL_48H);
        } else {
          // Missing fields
          GlobalAuth.setAccessToken(at); // To be able to update user fields
          return { missingFields };
        }
      } catch (e) {
        showErrorAlert("Error signing in with Apple", e.message);
      } finally {
        setAppleLoading(false);
      }
    },
    [signInWithApple]
  );

  const clearContext = useCallback(async () => {
    await clearRefreshToken();
    await cacheDeleteAllCacheWithoutStartWorkout();
    GlobalAuth.setAccessToken(null);
    GlobalAuth.setUsernameInHeader(null);
    resetBootstrap();
    setIsLoggedIn(false);
    setLoading(false);
    setAppleLoading(false);
    setGoogleLoading(false);
    setUser(null);
    setIsWorkoutMode(false);
    setUserIdCache(null);
    setIsValidatedWithServer(false);
    setAuthPhase("guest");
    attemptedServerValidationRef.current = false;
    serverValidatingLockRef.current = false;
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
      userIdCache,
      loading,
      userDataLoading,
      // actions
      register,
      login,
      googleLoading,
      appleLoading,
      handleAppleAuth,
      handleGoogleAuth,
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
      userIdCache,
      loading,
      googleLoading,
      appleLoading,
      userDataLoading,
      register,
      login,
      handleAppleAuth,
      handleGoogleAuth,
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
