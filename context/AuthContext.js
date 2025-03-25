import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../src/supabaseClient";
import { Alert } from "react-native";

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
        const userData = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setUser(userData);
      } else {
        setIsLoggedIn(false);
        setUser(null);
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

  const register = async (email, password, username, fullName, gender) => {
    try {
      const { data: existingUser, error: checkUserError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (checkUserError && checkUserError.message !== "No rows found") {
        throw checkUserError;
      }

      if (existingUser) {
        console.log("User already exists, logging in...");
        Alert.alert("Username is taken.");
        return;
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        }
      );

      if (signUpError) {
        throw signUpError;
      }

      const userId = authData.user.id;

      const { error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          email,
          username,
          name: fullName,
          gender,
          level: 0,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      const { data: fullUser, error: fetchError } = await supabase
        .from("users")
        .select("id, *")
        .eq("username", username);

      if (!fullUser) {
        return;
      }
      login(username, password);
    } catch (error) {
      console.error("Error during registration:", error.message);
      throw new Error("Registration Failed");
    }
  };

  const login = async (username, password) => {
    const { data: userRow, error } = await supabase
      .from("users")
      .select("email")
      .eq("username", username)
      .single();

    if (error || !userRow) {
      throw new Error("Username not found");
    }

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: userRow.email,
      password,
    });

    if (loginError) {
      throw loginError;
    } else {
      const { data: fullUser, error: fetchError } = await supabase
        .from("users")
        .select("id, *")
        .eq("username", username);
      if (!fullUser) {
        return;
      } else {
        setIsLoggedIn(true);
        setUser(fullUser[0]);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await supabase.auth.setAuth(null);
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
