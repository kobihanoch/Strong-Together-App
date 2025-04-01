import {
  Inter_400Regular,
  Inter_700Bold,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  CommonActions,
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import BottomTabBar from "./components/BottomTabBar";
import Theme1 from "./components/Theme1";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppStack from "./navigation/AppStack";
import AuthStack from "./navigation/AuthStack";
import { StatusBar } from "react-native";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigationRef = useNavigationContainerRef();

  const loadFonts = async () => {
    await Font.loadAsync({
      PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),
      Inter_400Regular,
      Inter_700Bold,
      Inter_500Medium,
      Inter_600SemiBold,
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const handleLogoutReset = () => {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "AuthStack" }],
        })
      );
    }
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
          <StatusBar barStyle="dark-content" />
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
