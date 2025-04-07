import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/AuthService";
import { getUserData } from "../services/UserService";
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
    const checkIfUserSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        console.log("Session exists");
        const userData = await getUserData(session.user.id);

        if (!userData) {
          console.log("USER NOT FOUND");
          return;
        }

        console.log("User found: " + JSON.stringify(userData, null, 2));
        setIsLoggedIn(true);
        setUser(userData);
      } else {
        console.log("Session doesn't exist");
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkIfUserSession();
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
      const user = result.user;
      setIsLoggedIn(true);
      setUser(user);
      console.log("✅ Login successful - waiting for onAuthStateChange...");
    } catch (err) {
      console.log("Error logging in: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    //await Updates.reloadAsync();
    //await AsyncStorage.clear();
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
