import { useNavigation, useNavigationState } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dialog } from "react-native-alert-notification";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const BottomTabBar = () => {
  const navigation = useNavigation();
  const routeName = useNavigationState((state) => {
    const appRoute = state?.routes?.[state.index];
    const nested = appRoute?.state;
    if (nested?.routes?.length) {
      const inner = nested.routes[nested.index];
      return inner?.name ?? appRoute?.name ?? "Home";
    }
    return appRoute?.name ?? "Home";
  });
  const { isWorkoutMode } = useAuth();

  const handleTabPress = (tabName) => {
    navigation.navigate(tabName);
  };

  //----------------- [ Workout mode ]-----------------

  const confirmExit = () => {
    pressedExitRef.current = false;

    Dialog.show({
      type: "WARNING",
      title: "Exit workout",
      titleStyle: {
        fontSize: 22,
      },
      textBody: "Are you sure you want to quit?",
      textBodyStyle: {
        fontSize: 45,
      },
      button: "Exit workout",
      closeOnOverlayTap: true,
      onPressButton: () => {
        pressedExitRef.current = true;
        Dialog.hide();
        navigation.goBack();
      },
      onHide: () => {
        if (!pressedExitRef.current) {
          setShowExitButton(false);
        }
      },
    });
  };

  const tabs = [
    { name: "Home", icon: "home-variant" },
    { name: "Statistics", icon: "poll" },
    { name: "MyWorkoutPlan", label: "StartWorkout", icon: "fire" },
    { name: "Profile", icon: "account" },
    { name: "Settings", icon: "wrench" },
  ];

  return (
    !isWorkoutMode && (
      <View style={styles.tabBarContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              index !== tabs.length - 1 && styles.tabSeparator,
              tab.name === "MyWorkoutPlan" && styles.specialTabButton,
            ]}
            onPress={() => handleTabPress(tab.name)}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={RFValue(20)}
              color={routeName === tab.name ? "#2979FF" : "rgb(184, 184, 184)"}
              style={tab.name === "MyWorkoutPlan" && styles.specialIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.12,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingBottom: height * 0.02,
    width: "100%",
  },
  tabButton: {
    alignItems: "center",
    width: width * 0.2,
    marginHorizontal: height * -0.002,
  },
  specialTabButton: {
    backgroundColor: "#2979FF",
    borderRadius: width * 0.15,
    padding: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  specialIcon: {
    color: "white",
  },
  timerText: {
    color: "#2979FF",
    fontSize: RFValue(12),
    fontFamily: "Inter_700Bold",
  },
  exitButton: {
    color: "#2979FF",
    fontSize: RFValue(12),
    fontFamily: "Inter_700Bold",
  },
});

export default BottomTabBar;
