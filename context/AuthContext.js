import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/AuthService";
import supabase from "../src/supabaseClient";
import * as Updates from "expo-updates";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

let authListener = null;

export const AuthProvider = ({ children, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);

  useEffect(() => {
    const waitForUser = async (retries = 5, delay = 300) => {
      for (let i = 0; i < retries; i++) {
        const { data } = await supabase.auth.getSession();
        const user = data?.session?.user;
        if (user?.id) {
          return user;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      return null;
    };

    const loadFullUser = async (userId) => {
      const { data: fullUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (fullUser) {
        setUser(fullUser);
        setIsLoggedIn(true);
        console.log("Loaded user:", fullUser);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        console.warn("Failed to load user:", error?.message);
      }
    };

    if (!authListener) {
      authListener = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth event:", event, session);

        if (session?.user?.id) {
          await loadFullUser(session.user.id);
        } else {
          const recoveredUser = await waitForUser();
          if (recoveredUser) {
            console.log("Recovered user after TOKEN_REFRESHED delay");
            await loadFullUser(recoveredUser.id);
          } else {
            setUser(null);
            setIsLoggedIn(false);
            console.log("Session is null or user not found after retries");
          }
        }
      }).data.subscription;
    }

    const loadInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;

      if (user?.id) {
        await loadFullUser(user.id);
        console.log("Loaded user on app start");
      } else {
        setUser(null);
        setIsLoggedIn(false);
        console.log("No session on app start");
      }
    };

    loadInitialSession();
  }, []);

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
      const userId = result.user.id;
      await loadFullUser(userId);
      console.log("✅ Login successful - waiting for onAuthStateChange...");
    } catch (err) {
      console.log("Error logging in: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log(
      "AuthContext auth session before logout: " + JSON.stringify(data)
    );
    setIsLoggedIn(false);
    setUser(null);
    await Updates.reloadAsync();
    await AsyncStorage.clear();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
