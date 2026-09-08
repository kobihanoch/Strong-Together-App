import { createStackNavigator } from '@react-navigation/stack';
import Intro from '../screens/intro/Intro';
import Login from '../screens/login/LogIn';
import Register from '../screens/register/Register';
import { AuthRootParamList } from './types/auth-stack.types';

const Stack = createStackNavigator<AuthRootParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Intro">
      <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      {/*<Stack.Screen
        name="OAuthCompleteFields"
        component={OAuthCompleteFields}
        options={{ headerShown: false }}
      />*/}
    </Stack.Navigator>
  );
};

export default AuthStack;
