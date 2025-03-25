import {
  NavigationContainer,
  useNavigationContainerRef,
  CommonActions,
} from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AuthStack from "./navigation/AuthStack";
import AppStack from "./navigation/AppStack";
import BottomTabBar from "./components/BottomTabBar";
import Theme1 from "./components/Theme1";
import * as Font from "expo-font";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigationRef = useRef();

  const loadFonts = async () => {
    await Font.loadAsync({
      PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),
      PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
      PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const handleLogoutReset = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Intro" }],
      })
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider onLogout={handleLogoutReset}>
      <NavigationContainer ref={navigationRef}>
        <AuthWrapper />
      </NavigationContainer>
    </AuthProvider>
  );
}

function AuthWrapper() {
  const { isLoggedIn } = useAuth();
  const [selectedTab, setSelectedTab] = useState("Home");

  const handleTabPress = (tabName) => {
    setSelectedTab(tabName);
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? (
        <>
          <Theme1>
            <AppStack />
          </Theme1>
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
    justifyContent: "center",
    alignItems: "center",
  },
});
