import 'react-native-url-polyfill/auto';

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
import { createStackNavigator } from "@react-navigation/stack";
import { NotificationsProvider } from "./context/NotificationsContext";
import NotificationsSetup from "./notifications/NotificationsSetup";
import * as Notifications from "expo-notifications";

const RootStack = createStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigationRef = useNavigationContainerRef();

  // This tells Expo to show the notification even when app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false, // CHANGE ALL TO TRUE ON BUILD
    }),
  });

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
          routes: [{ name: "Auth" }],
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
      <WrappedWithNotifications />
    </AuthProvider>
  );
}

const WrappedWithNotifications = () => {
  const { user } = useAuth();
  const navigationRef = useNavigationContainerRef();

  return (
    <NotificationsProvider user={user}>
      <NavigationContainer ref={navigationRef}>
        <MainNavigator />
      </NavigationContainer>
    </NotificationsProvider>
  );
};

function MainNavigator() {
  const { isLoggedIn, initial } = useAuth();
  useEffect(() => {
    (async () => {
      await initial.checkIfUserSession();
    })();
  }, []);
  console.log("🧠 isLoggedIn value:", isLoggedIn);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <RootStack.Screen name="App" component={AppWrapper} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStack} />
      )}
    </RootStack.Navigator>
  );
  function AppWrapper() {
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
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
