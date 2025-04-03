import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/AuthService";
import supabase from "../src/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, session);

        if (session?.user?.id) {
          await loadFullUser(session.user.id);
          navigation.navigate("Home");
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
      }
    );

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

    return () => {
      listener.subscription.unsubscribe();
    };
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
      setIsLoggedIn(true);
      setUser(result.user);
    } catch (err) {
      console.log("Error logging in: " + err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log("HI");
    const { data, error } = await supabase.auth.getSession();
    console.log(
      "AuthContext auth session before logout: " + JSON.stringify(data)
    );
    await supabase.auth.signOut();
    const { data: data2, error: error2 } = await supabase.auth.getSession();
    console.log(
      "AuthContext auth session after logout: " + JSON.stringify(data2)
    );
    setIsLoggedIn(false);
    setUser(null);

    if (onLogout) onLogout();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
