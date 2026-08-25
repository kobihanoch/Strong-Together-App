/* eslint-disable @typescript-eslint/no-require-imports */
require('./global');
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import { MessagesProvider } from './features/messages/providers/MessagesProvider';
import { WorkoutHistoryProvider } from './features/workouts/shared/providers/WorkoutHistoryProvider';

import { MaterialCommunityIcons as ExpoMaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { NotifierRoot } from 'react-native-notifier';
import { AuthProvider, useAuth } from './features/auth/shared/providers/AuthProvider';
import NotificationsSetup from './features/settings/push-notifications-setup/notifications-setup.setup';
import { CardioProvider } from './features/workouts/shared/providers/CardioProvider';
import { WorkoutPlanProvider } from './features/workouts/shared/providers/WorkoutPlanProvider';
import ensureDpopKeyPair from './infrastructure/api/dpop/ensureDpopKeyPair';
import { cacheHousekeepingOnBoot } from './infrastructure/cache/cache.utils';
import Sentry from './infrastructure/sentry';
import AppStack from './navigation/AppStack';
import AuthStack from './navigation/AuthStack';
import BottomTabBar from './shared/components/BottomTabBar';
import Theme1 from './shared/components/Theme1';
import UpdateAppModal from './shared/components/UpdateAppModal';
import { GlobalAppLoadingProvider } from './shared/providers/GlobalAppLoadingProvider';
import { AppThemeProvider } from './shared/providers/AppThemeProvider';

// ---------- Fonts Loader Hook ----------
function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        console.log('[Fonts]: Loading app fonts');
        await Font.loadAsync({
          PoppinsLight: require('./assets/fonts/Poppins-Light.ttf'),
          PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
          PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
          Inter_400Regular,
          Inter_700Bold,
          Inter_500Medium,
          Inter_600SemiBold,
          ...ExpoMaterialCommunityIcons.font,
        });
        console.log('[Fonts]: Fonts ready');
      } catch (error) {
        console.error('[Fonts]: Failed to load fonts', error);
      } finally {
        setReady(true);
      }
    })();
  }, []);
  return ready;
}

// ---------- App Root ----------
function App() {
  const fontsReady = useFontsReady();
  const navigationRef = useNavigationContainerRef();
  const [keyPairReady, setKeyPairReady] = useState(false);

  // Dpop key pair
  useEffect(() => {
    (async () => {
      if (!keyPairReady) {
        await ensureDpopKeyPair();
        setKeyPairReady(true);
      }
    })();
  }, [keyPairReady]);

  // Delete cache for outdated app versions (against different data structures)
  useEffect(() => {
    (async () => {
      const cacheVer = await AsyncStorage.getItem('__VERSION__');
      const appVer = Constants?.expoConfig?.version;
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
    keyPairReady && (
      <Sentry.ErrorBoundary fallback={<AppCrashFallback />}>
        <AlertNotificationRoot>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <GlobalAppLoadingProvider>
              <AppThemeProvider>
                <AuthProvider>
                  <NavigationContainer ref={navigationRef}>
                    <RootNavigator />
                    <NotifierRoot />
                    <UpdateAppModal />
                  </NavigationContainer>
                </AuthProvider>
              </AppThemeProvider>
            </GlobalAppLoadingProvider>
          </GestureHandlerRootView>
        </AlertNotificationRoot>
      </Sentry.ErrorBoundary>
    )
  );
}

export default App;

// ---------- Navigation Logic (auth-only here) ----------
function RootNavigator() {
  const { isLoggedIn, user, authPhase } = useAuth();

  // Ensures no UI is rendered if auth is not loaded yet
  if (authPhase === 'checking') return null;

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
    <MessagesProvider>
      <WorkoutPlanProvider>
        <WorkoutHistoryProvider>
          <CardioProvider>
            <MainApp />
          </CardioProvider>
        </WorkoutHistoryProvider>
      </WorkoutPlanProvider>
    </MessagesProvider>
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

function AppCrashFallback() {
  return (
    <View style={styles.loadingContainer}>
      <Text>Something went wrong.</Text>
      <Text>Please restart the app.</Text>
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
