import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const Settings = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, paddingVertical: height * 0.02 }}>
      <TouchableOpacity onPress={logout}>
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: RFValue(14),
            color: "red",
          }}
        >
          Log Out
        </Text>
      </TouchableOpacity>
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
