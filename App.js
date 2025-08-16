// App.js
// English comments only inside code

import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AlertNotificationRoot } from "react-native-alert-notification";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import * as Font from "expo-font";

import {
  Inter_400Regular,
  Inter_700Bold,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  NotificationsProvider,
  useNotifications,
} from "./context/NotificationsContext";
import { WorkoutProvider, useWorkoutContext } from "./context/WorkoutContext";
import {
  AnalysisProvider,
  useAnalysisContext,
} from "./context/AnalysisContext";

import AppStack from "./navigation/AppStack";
import AuthStack from "./navigation/AuthStack";
import Theme1 from "./components/Theme1";
import BottomTabBar from "./components/BottomTabBar";
import MainLoadingScreen from "./components/MainLoadingScreen";
import NotificationsSetup from "./notifications/NotificationsSetup";

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

  if (!fontsReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AlertNotificationRoot>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
          {/* <NotifierRoot /> */}
        </AuthProvider>
      </GestureHandlerRootView>
    </AlertNotificationRoot>
  );
}

// ---------- Navigation Logic (auth-only here) ----------
function RootNavigator() {
  const { isLoggedIn, sessionLoading, user } = useAuth();

  // While session is resolving, show the global loader
  if (sessionLoading) return <MainLoadingScreen />;

  // When logged in, mount the app-scoped providers branch
  return isLoggedIn ? <AppWithProviders key={user?.id} /> : <AuthStack />;
}

// ---------- App branch wrapped with app-scoped providers ----------
function AppWithProviders() {
  return (
    <NotificationsProvider>
      <WorkoutProvider>
        <AnalysisProvider>
          <AppLoadingGate />
        </AnalysisProvider>
      </WorkoutProvider>
    </NotificationsProvider>
  );
}

// ---------- Loading gate that waits for app providers ----------
function AppLoadingGate() {
  // Read loading flags from app providers
  const { loadingMessages } = useNotifications();
  const { loading: loadingWorkout } = useWorkoutContext();
  const { loading: loadingAnalysis } = useAnalysisContext();

  // Keep a singleton instance of the loader to avoid flicker on transitions
  const loaderRef = useRef(<MainLoadingScreen />);

  if (loadingMessages || loadingWorkout || loadingAnalysis) {
    return loaderRef.current;
  }

  return <MainApp />;
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
