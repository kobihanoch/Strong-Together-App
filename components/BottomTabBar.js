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

const { width, height } = Dimensions.get("window");

const BottomTabBar = () => {
  const navigation = useNavigation();
  const routeName = useNavigationState((state) => {
    const appRoute = state.routes[state.index];
    const nestedState = appRoute.state;

    if (nestedState && nestedState.routes && nestedState.routes.length > 0) {
      const innerRoute = nestedState.routes[nestedState.index];
      return innerRoute.name;
    }

    return "Home";
  });

  //----------------- [ Workout mode ]-----------------
  const isWorkoutMode = routeName === "StartWorkout";

  // Start time as timestamp
  const [startTime, setStartTime] = useState(null);
  // Current time refreshed each second
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showExitButton, setShowExitButton] = useState(false);

  useEffect(() => {
    if (isWorkoutMode) {
      const now = Date.now();
      setStartTime(now); // Save the moment workout started

      const timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);

      setShowExitButton(false);

      return () => clearInterval(timer);
    }
  }, [isWorkoutMode]);

  // Calculate how many seconds have passed
  const elapsedSeconds = startTime
    ? Math.floor((currentTime - startTime) / 1000)
    : 0;

  const formatTime = () => {
    const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
    const remainingSeconds = String(elapsedSeconds % 60).padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };

  //-----------------[ Regular tab bar ]-----------------
  const handleTabPress = (tabName) => {
    navigation.navigate(tabName);
  };

  const handleTimerPress = () => {
    setShowExitButton(true);
    setTimeout(() => setShowExitButton(false), 3000);
  };

  const pressedExitRef = useRef(false);

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
    <View style={styles.tabBarContainer}>
      {tabs.map((tab, index) =>
        isWorkoutMode && tab.name === "MyWorkoutPlan" ? (
          <TouchableOpacity
            key={index}
            style={[styles.tabButton, styles.specialTabButton]}
            onPress={showExitButton ? confirmExit : handleTimerPress}
          >
            {showExitButton ? (
              <FontAwesome5 name="times" size={RFValue(20)} color="red" />
            ) : (
              <Text style={styles.timerText}>{formatTime()}</Text>
            )}
          </TouchableOpacity>
        ) : (
          !isWorkoutMode && (
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
                color={
                  routeName === tab.name ? "#2979FF" : "rgb(184, 184, 184)"
                }
                style={tab.name === "MyWorkoutPlan" && styles.specialIcon}
              />
            </TouchableOpacity>
          )
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.095,
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
    color: "white",
    fontSize: RFValue(12),
    fontFamily: "Inter_700Bold",
  },
  exitButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomTabBar;
