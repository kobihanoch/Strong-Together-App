import { createStackNavigator } from '@react-navigation/stack';
import Intro from '../screens/Intro';  // ודא שהייבוא של Intro נכון
import Login from '../screens/LogIn';
import Register from '../screens/Register';

const Stack = createStackNavigator();

const AuthStack = ({ setIsLoggedIn }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {props => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthStack;