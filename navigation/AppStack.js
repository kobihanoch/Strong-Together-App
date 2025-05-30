import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Settings from "../screens/Settings";
import MyWorkoutPlan from "../screens/MyWorkoutPlan";
import StartWorkout from "../screens/StartWorkout";
import CreateWorkout from "../screens/CreateWorkout";
import Profile from "../screens/Profile";
import Statistics from "../screens/Statistics";
import Inbox from "../screens/Inbox";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,

        cardStyle: { backgroundColor: "#F9F9F9", flex: 1 },
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyWorkoutPlan" component={MyWorkoutPlan} />
      <Stack.Screen name="StartWorkout" component={StartWorkout} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen name="Inbox" component={Inbox} />
    </Stack.Navigator>
  );
};

export default AppStack;
