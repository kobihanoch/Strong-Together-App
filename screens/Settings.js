import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import GoToButton from "../components/HomeComponents/GoToButton";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const Settings = ({ navigation }) => {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <View style={{ flex: 1, paddingVertical: height * 0.02 }}>
      <GoToButton onPress={handleLogout}>
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: RFValue(14),
            color: "red",
          }}
        >
          Log Out
        </Text>
      </GoToButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: "skyblue",
    marginBottom: 10,
  },
});

export default Settings;
