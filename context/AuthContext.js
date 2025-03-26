import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../src/supabaseClient";
import { Alert } from "react-native";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Need to check - should workout because now we load the session status from supabase and not from ASYNC storage, which we dont support anymore
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);

        if (session) {
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
            console.log("Failed to load full user:", error);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
          console.log("No session found");
        }
      }
    );

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
    try {
      const { data: existingUser, error: checkUserError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (checkUserError) {
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
        .eq("username", username)
        .single();

      if (!fullUser) {
        return;
      } else {
        setIsLoggedIn(true);
        setUser(fullUser[0]);
      }
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
      value={{ isLoggedIn, user, register, login, logout, updateProfilePic }}
    >
      {children}
    </AuthContext.Provider>
  );
};
