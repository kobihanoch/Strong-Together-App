import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
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
  /*useEffect(() => {
    console.log("App stack mounted");
    return () => console.log("App stack unmounted");
  }, []);*/

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { backgroundColor: "rgba(255, 255, 255, 1)", flex: 1 },
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
      <Stack.Screen name="Analytics" component={Analytics} />
    </Stack.Navigator>
  );
};

export default AppStack;
