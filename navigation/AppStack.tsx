import { useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { cacheDeleteKey, cacheGetJSON } from '../../../../infrastructure/cache/cache.utils';
import { keyStartWorkout } from '../../../../infrastructure/cache/cache-keys.utils';
import { useAuth } from '../../../guest-user/auth/shared/providers/AuthProvider';
import Analytics from '../../workouts/analytics/screen/Analytics';
import CreateWorkout from '../../workouts/editor/screen/CreateWorkout';
import Home from '../../home/screen/Home';
import Inbox from '../../messages/screen/Inbox';
import MyWorkoutPlan from '../../workouts/plan/screen/MyWorkoutPlan';
import Profile from '../../profile/screen/Profile';
import Settings from '../../settings/screen/Settings';
import StartWorkout from '../../workouts/session/screen/StartWorkout';
import Statistics from '../../workouts/history/screen/Statistics';
import { ymdInCurrentTZ } from '../../../../shared/utils/shared-utils';
import { ResumeWorkoutCachePayload } from '../../workouts/session/types/use-start-workout.types';
import { RootParamList } from './types/appStackTypes';

const Stack = createStackNavigator<RootParamList>();

const AppStack = () => {
  const { userIdCache } = useAuth();
  // Decide initial route once we know if there is a cached workout
  const nav = useNavigation<StackNavigationProp<RootParamList>>();
  // Resume workout if interuptted
  useEffect(() => {
    (async () => {
      if (userIdCache) {
        const payload = await cacheGetJSON<ResumeWorkoutCachePayload>(keyStartWorkout(userIdCache));
        if (payload?.workout && payload?.startTime && nav) {
          // If workout is not from today -> delete cache
          const startDay = ymdInCurrentTZ(payload.startTime);
          const today = ymdInCurrentTZ(Date.now());
          const isStale = startDay !== today;
          if (isStale) {
            // English-only comments: If from a previous day â†’ delete and stop (no resume)
            await cacheDeleteKey(keyStartWorkout(userIdCache));
            return;
          }
          nav.navigate('StartWorkout', {
            workoutSplit: payload.selectedSplit,
            resumedWorkout: {
              workout: payload.workout,
              startTime: payload.startTime,
              pausedTotal: payload.pausedTotal,
              lastPause: payload.lastPause,
            },
          });
        }
      }
    })();
  }, [userIdCache, nav]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyle: { backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1 },
      }}
      initialRouteName={'Home'}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyWorkoutPlan" component={MyWorkoutPlan} />
      <Stack.Screen name="StartWorkout" component={StartWorkout} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen name="Inbox" component={Inbox} />
      <Stack.Screen name="Analytics" component={Analytics} />
    </Stack.Navigator>
  );
};

export default AppStack;
