import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import BottomTabBar from "../components/BottomTabBar";
import Theme1 from "../components/Theme1";
import GoToButton from "../components/HomeComponents/GoToButton";
import { useAuth } from "../context/AuthContext";
import { CommonActions } from "@react-navigation/native";

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
            fontFamily: "PoppinsBold",
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
