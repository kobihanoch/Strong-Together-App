import { createStackNavigator } from '@react-navigation/stack';
import Intro from '../../guest-user/auth/intro/screen/Intro';
import Login from '../../guest-user/auth/login/screen/LogIn';
import Register from '../../guest-user/auth/register/screen/Register';
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
