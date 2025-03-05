import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
      const savedUser = await AsyncStorage.getItem('user');

      if (loggedInStatus === 'true' && savedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(savedUser));
      }
    };

    checkLoginStatus();
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};