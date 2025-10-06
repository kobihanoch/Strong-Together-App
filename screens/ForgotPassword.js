import React from "react";
import { Text, View } from "react-native";

const ForgotPassword = ({ route, navigation }) => {
  const { token = null } = route.params || {};
  if (!token) navigation.navigate("Intro");
  return (
    <View>
      <Text>Forgot password</Text>
    </View>
  );
};

export default ForgotPassword;
