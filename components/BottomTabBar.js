import { useNavigation, useNavigationState } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
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
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const BottomTabBar = ({ selectedTab, onTabPress }) => {
  const navigation = useNavigation();
  const routeName = useNavigationState(
    (state) => state?.routes?.[state.index]?.name || ""
  );

  const isWorkoutMode = routeName === "StartWorkout";

  const [seconds, setSeconds] = useState(0);
  const [showExitButton, setShowExitButton] = useState(false);

  useEffect(() => {
    if (isWorkoutMode) {
      setSeconds(0);
      setShowExitButton(false);
      const timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isWorkoutMode]);

  const formatTime = () => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const remainingSeconds = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };

  const handleTabPress = (tabName) => {
    onTabPress(tabName);
    navigation.navigate(tabName);
  };

  const handleTimerPress = () => {
    setShowExitButton(true);

    setTimeout(() => {
      setShowExitButton(false);
    }, 3000);
  };

  const confirmExit = () => {
    Alert.alert(
      "Exit workout",
      "Are you sure you want to quit? All of the progress will be terminated.",
      [
        {
          text: "Continue workout",
          style: "cancel",
          onPress: () => setShowExitButton(false),
        },
        {
          text: "Exit workout",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const tabs = [
    { name: "Home", label: "Home", icon: "home-variant" },
    { name: "Statistics", label: "Statistics", icon: "poll" },
    { name: "MyWorkoutPlan", label: "StartWorkout", icon: "fire" },
    { name: "Profile", label: "Profile", icon: "account" },
    { name: "Settings", label: "Settings", icon: "wrench" },
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
                  selectedTab === tab.name ? "#2979FF" : "rgb(184, 184, 184)"
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
