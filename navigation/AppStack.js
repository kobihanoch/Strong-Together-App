import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Settings from "../screens/Settings";
import MyWorkoutPlan from "../screens/MyWorkoutPlan";
import StartWorkout from "../screens/StartWorkout";
import PostWorkoutSummary from "../screens/PostWorkoutSummary";
import CreateWorkout from "../screens/CreateWorkout";
import Profile from "../screens/Profile";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyle: { backgroundColor: "white", flex: 0.88 },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyWorkoutPlan" component={MyWorkoutPlan} />
      <Stack.Screen name="StartWorkout" component={StartWorkout} />
      <Stack.Screen name="PostWorkoutSummary" component={PostWorkoutSummary} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
    </Stack.Navigator>
  );
};

export default AppStack;
