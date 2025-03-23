import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedInStatus = await AsyncStorage.getItem("isLoggedIn");
      const savedUser = await AsyncStorage.getItem("user");

      if (loggedInStatus === "true" && savedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(savedUser));
      }
    };

    checkLoginStatus();
  }, []);

  const updateProfilePic = (picUrl) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, profile_image_url: picUrl };
      AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    AsyncStorage.setItem("isLoggedIn", "true");
    AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    await AsyncStorage.removeItem("isLoggedIn");
    await AsyncStorage.removeItem("user");
    if (onLogout) onLogout();
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, updateProfilePic }}
    >
      {children}
    </AuthContext.Provider>
  );
};
