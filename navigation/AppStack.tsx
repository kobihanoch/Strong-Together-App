import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from '../screens/home/Home';
import Inbox from '../screens/inbox/Inbox';
import CreateWorkout from '../screens/modify-workout/CreateWorkout';
import MyWorkoutPlan from '../screens/my-workout-plan/MyWorkoutPlan';
import Profile from '../screens/profile/Profile';
import Settings from '../screens/settings/Settings';
import TrackHistory from '../screens/track-history/TrackHistory';
import WorkoutSession from '../screens/workout-session/WorkoutSession';
import WorkoutSummary from '../screens/workout-session/WorkoutSummary';
import { useAppTheme } from '../shared/providers/AppThemeProvider';
import useWorkoutSessionResume from './hooks/use-workout-session-resume.hook';
import { RootParamList } from './types/appStackTypes';

const Stack = createStackNavigator<RootParamList>();

const AppStack = () => {
  const { colors: theme } = useAppTheme();
  const { resume, restoredWorkoutSplit, isHydrating } = useWorkoutSessionResume();

  if (isHydrating) return null;

  return (
    <Stack.Navigator
      initialRouteName={resume ? 'WorkoutSession' : 'Home'}
      screenOptions={{ headerShown: false, gestureEnabled: false, cardStyle: { backgroundColor: theme.canvas, flex: 1 } }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyWorkoutPlan" component={MyWorkoutPlan} />
      <Stack.Screen
        name="WorkoutSession"
        component={WorkoutSession}
        {...(restoredWorkoutSplit ? { initialParams: { workoutSplit: restoredWorkoutSplit } } : {})}
      />
      <Stack.Screen name="WorkoutSummary" component={WorkoutSummary} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
      <Stack.Screen name="TrackHistory" component={TrackHistory} />
      <Stack.Screen name="Inbox" component={Inbox} />
    </Stack.Navigator>
  );
};

export default AppStack;
