import { createStackNavigator } from "@react-navigation/stack";
import Intro from "../screens/Intro";
import Login from "../screens/LogIn";
import Register from "../screens/Register";
import OAuthCompleteFields from "../screens/OAuthCompleteFields";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Intro">
      <Stack.Screen
        name="Intro"
        component={Intro}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OAuthCompleteFields"
        component={OAuthCompleteFields}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
