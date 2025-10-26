// AppStack.jsx

import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { cacheGetJSON, keyStartWorkout } from "../cache/cacheUtils";
import { useAuth } from "../context/AuthContext";
import Analytics from "../screens/Analytics";
import CreateWorkout from "../screens/CreateWorkout";
import Home from "../screens/Home";
import Inbox from "../screens/Inbox";
import MyWorkoutPlan from "../screens/MyWorkoutPlan";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import StartWorkout from "../screens/StartWorkout";
import Statistics from "../screens/Statistics";

const Stack = createStackNavigator();

const AppStack = () => {
  const { userIdCache } = useAuth();
  // Decide initial route once we know if there is a cached workout
  const nav = useNavigation();
  // Resume workout if interuptted
  useEffect(() => {
    (async () => {
      const payload = await cacheGetJSON(keyStartWorkout(userIdCache));
      if (payload?.workout && payload?.startTime && nav) {
        nav.navigate("StartWorkout", {
          workoutSplit: payload.selectedSplit,
          resumedWorkout: {
            workout: payload.workout,
            startTime: payload.startTime,
            pausedTotal: payload.pausedTotal,
            lastPause: payload.lastPause,
          },
        });
      }
    })();
  }, [userIdCache, nav]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyle: { backgroundColor: "rgba(255, 255, 255, 1)", flex: 1 },
      }}
      initialRouteName={"Home"}
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
