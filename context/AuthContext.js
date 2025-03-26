import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../src/supabaseClient";
import { Alert } from "react-native";
import { registerUser, loginUser } from "../services/AuthService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);

        if (session?.user?.id) {
          setIsLoggedIn(true);

          const { data: fullUser, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (fullUser) {
            setUser(fullUser);
            console.log("Full user loaded:", fullUser);
          } else {
            setUser(null);
            console.warn("Failed to load full user:", error?.message);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
          console.log("Session is null or user missing:", session);
        }
      }
    );

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setIsLoggedIn(true);
        const { data: fullUser, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (fullUser) {
          setUser(fullUser);
          console.log("Full user loaded on initial session check");
        } else {
          setUser(null);
          console.warn(
            "Failed to load user from initial session:",
            error?.message
          );
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        console.log("No session on app start");
      }
    };

    loadSession();

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
    console.log("sdfdffsdfd");
    const result = await loginUser(username, password);
    if (!result.success) {
      throw new Error(result.reason);
    }
    setIsLoggedIn(true);
    setUser(result.user);
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
      value={{ isLoggedIn, user, register, login, logout, updateProfilePic }}
    >
      {children}
    </AuthContext.Provider>
  );
};
