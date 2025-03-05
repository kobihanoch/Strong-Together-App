import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack'; 
import AppStack from './navigation/AppStack';    
import * as Font from 'expo-font';
import BottomTabBar from './components/BottomTabBar'; 
import { AuthProvider, useAuth } from './context/AuthContext'; 
import Theme1 from './components/Theme1';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'PoppinsLight': require('./assets/fonts/Poppins-Light.ttf'),
      'PoppinsRegular': require('./assets/fonts/Poppins-Regular.ttf'),
      'PoppinsBold': require('./assets/fonts/Poppins-Bold.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthWrapper />
      </NavigationContainer>
    </AuthProvider>
  );
}


function AuthWrapper() {
  const { isLoggedIn } = useAuth();  
  const [selectedTab, setSelectedTab] = useState('Home');

  const handleTabPress = (tabName) => {
    setSelectedTab(tabName);
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? (
        <>
          <Theme1><AppStack /></Theme1>
          <BottomTabBar selectedTab={selectedTab} onTabPress={handleTabPress} />
        </>
      ) : (
        <AuthStack />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});