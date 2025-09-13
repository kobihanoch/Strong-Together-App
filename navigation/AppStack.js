// AppStack.jsx
// English comments only
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import Analytics from "../screens/Analytics";
import CreateWorkout from "../screens/CreateWorkout";
import Home from "../screens/Home";
import Inbox from "../screens/Inbox";
import MyWorkoutPlan from "../screens/MyWorkoutPlan";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import StartWorkout from "../screens/StartWorkout";
import Statistics from "../screens/Statistics";
import { cacheGetJSON, keyStartWorkout } from "../cache/cacheUtils";
import { useAuth } from "../context/AuthContext";

const Stack = createStackNavigator();

const AppStack = () => {
  const { user } = useAuth();

  // Decide initial route once we know if there is a cached workout
  const [initialRoute, setInitialRoute] = useState(null);
  const [resumeParams, setResumeParams] = useState(null);

  // Resume workout if interuptted
  useEffect(() => {
    (async () => {
      const payload = await cacheGetJSON(keyStartWorkout(user.id));

      if (payload?.workout && payload?.startTime) {
        // Prepare params for StartWorkout
        setResumeParams({
          workoutSplit: payload.selectedSplit,
          resumedWorkout: {
            workout: payload.workout,
            startTime: payload.startTime,
          },
        });
        setInitialRoute("StartWorkout");
      } else {
        setInitialRoute("Home");
      }
    })();
  }, [user?.id]);

  // Render nothing (or a tiny loader) until the decision is made
  if (!initialRoute) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { backgroundColor: "rgba(255, 255, 255, 1)", flex: 1 },
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyWorkoutPlan" component={MyWorkoutPlan} />
      <Stack.Screen
        name="StartWorkout"
        component={StartWorkout}
        initialParams={resumeParams || undefined} // <-- inject resume params if any
      />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen name="Inbox" component={Inbox} />
      <Stack.Screen name="Analytics" component={Analytics} />
    </Stack.Navigator>
  );
};

export default AppStack;
