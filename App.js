// App.js
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { AnalysisProvider } from "./context/AnalysisContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { WorkoutProvider } from "./context/WorkoutContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { NotifierRoot } from "react-native-notifier";
import { cacheHousekeepingOnBoot } from "./cache/cacheUtils";
import BottomTabBar from "./components/BottomTabBar";
import Theme1 from "./components/Theme1";
import { GlobalAppLoadingProvider } from "./context/GlobalAppLoadingContext";
import AppStack from "./navigation/AppStack";
import AuthStack from "./navigation/AuthStack";
import NotificationsSetup from "./notifications/NotificationsSetup";
import LangProvider from "./src/i18n/LangProvider";

// ---------- Fonts Loader Hook ----------
function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),
        Inter_400Regular,
        Inter_700Bold,
        Inter_500Medium,
        Inter_600SemiBold,
      });
      setReady(true);
    })();
  }, []);
  return ready;
}

const RootStack = createStackNavigator();

// ---------- App Root ----------
export default function App() {
  const fontsReady = useFontsReady();
  const navigationRef = useNavigationContainerRef();

  // Delete cache for outdated app versions (against different data structures)
  useEffect(() => {
    (async () => {
      const cacheVer = await AsyncStorage.getItem("__VERSION__");
      const appVer = Constants.expoConfig.version;
      if (cacheVer === appVer) return; // already cleaned for this version
      await cacheHousekeepingOnBoot();
    })();
  }, []);

  if (!fontsReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <LangProvider>
      <AlertNotificationRoot>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GlobalAppLoadingProvider>
            <AuthProvider>
              <NavigationContainer ref={navigationRef}>
                <RootNavigator />
                <NotifierRoot />
              </NavigationContainer>
            </AuthProvider>
          </GlobalAppLoadingProvider>
        </GestureHandlerRootView>
      </AlertNotificationRoot>
    </LangProvider>
  );
}

// ---------- Navigation Logic (auth-only here) ----------
function RootNavigator() {
  const { isLoggedIn, user, authPhase } = useAuth();

  if (authPhase === "checking") return null;

  return (
    <>
      {/* Always render the tree so providers can mount */}
      {isLoggedIn ? <AppWithProviders key={user?.id} /> : <AuthStack />}
    </>
  );
}

// ---------- App branch wrapped with app-scoped providers ----------
function AppWithProviders() {
  return (
    <NotificationsProvider>
      <WorkoutProvider>
        <AnalysisProvider>
          <MainApp />
        </AnalysisProvider>
      </WorkoutProvider>
    </NotificationsProvider>
  );
}

// ---------- Logged-in shell UI ----------
function MainApp() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Theme1>
        <AppStack />
        <NotificationsSetup />
      </Theme1>
      <BottomTabBar />
    </>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
