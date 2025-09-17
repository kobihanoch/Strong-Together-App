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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ToggleSetting from "../components/NotificationsToggle";
import NotificationsToggle from "../components/NotificationsToggle";

const { width, height } = Dimensions.get("window");

const Settings = () => {
  const { user, logout } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: width * 0.04,
        paddingTop: height * 0.07,
      }}
    >
      <View style={{ flex: 1.5, justifyContent: "center" }}>
        <Text
          style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(25) }}
        >
          Settings
        </Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          width: "90%",
          alignSelf: "center",
          marginTop: height * 0.04,
          gap: height * 0.02,
          flex: 8.5,
        }}
      >
        <View style={[styles.box, { height: height * 0.1 }]}>
          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <Text
              style={{ fontFamily: "Inter_400Regular", fontSize: RFValue(15) }}
            >
              Notifications
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(12),
                color: "rgb(187, 187, 187)",
              }}
            >
              Allow push notifications
            </Text>
          </View>

          <NotificationsToggle></NotificationsToggle>
        </View>

        <TouchableOpacity style={styles.box} onPress={() => logout()}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: RFValue(15),
              color: "rgb(184, 33, 33)",
            }}
          >
            Log Out
          </Text>
          <MaterialCommunityIcons
            name="logout"
            size={RFValue(15)}
            color="rgb(166, 51, 51)"
          ></MaterialCommunityIcons>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    borderRadius: height * 0.012,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
    height: height * 0.06,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.04,
    flexDirection: "row",
  },
});

export default Settings;
