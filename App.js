import { NotifierRoot, NotifierWrapper } from "react-native-notifier";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AlertNotificationRoot } from "react-native-alert-notification";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from "react-native";
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
import { NotificationsProvider } from "./context/NotificationsContext";
import NotificationsSetup from "./notifications/NotificationsSetup";

import Theme1 from "./components/Theme1";
import BottomTabBar from "./components/BottomTabBar";
import MainLoadingScreen from "./components/MainLoadingScreen";

import AppStack from "./navigation/AppStack";
import AuthStack from "./navigation/AuthStack";

const RootStack = createStackNavigator();

/** ---------- Notifications: set once (outside components) ---------- */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false, // TODO: Show TRUE on build
  }),
});

/** ---------- Fonts Loader Hook ---------- */
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

/** ---------- App Root ---------- */
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
    // The package
    <AlertNotificationRoot>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <RootProviders navigationRef={navigationRef} />
          <NotifierRoot />
          <NotificationsSetup />
        </AuthProvider>
      </GestureHandlerRootView>
    </AlertNotificationRoot>
  );
}

/** ---------- Providers chain kept minimal ---------- */
function RootProviders({ navigationRef }) {
  const { user } = useAuth(); // מועבר ל-NotificationsProvider

  return (
    <NotificationsProvider user={user}>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
    </NotificationsProvider>
  );
}

/** ---------- Navigation Logic (single place) ---------- */
function RootNavigator() {
  const { isLoggedIn, sessionLoading } = useAuth();

  if (sessionLoading) return <MainLoadingScreen />;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <RootStack.Screen name="App" component={MainApp} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStack} />
      )}
    </RootStack.Navigator>
  );
}

/** ---------- Logged-in Shell UI ---------- */
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

/** ---------- Styles ---------- */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
