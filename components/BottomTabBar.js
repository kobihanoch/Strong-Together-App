import { useNavigation, useNavigationState } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

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
    { name: "Home", label: "Home", icon: "home" },
    { name: "Settings", label: "Settings", icon: "cog" },
    { name: "MyWorkoutPlan", label: "StartWorkout", icon: "dumbbell" },
    { name: "Profile", label: "Profile", icon: "user" },
    { name: "Statistics", label: "Statistics", icon: "chart-bar" },
  ];

  return (
    <LinearGradient
      colors={["#00142a", "#0d2540"]}
      style={styles.tabBarContainer}
    >
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
              <FontAwesome5
                name={tab.icon}
                size={RFValue(15)}
                color={selectedTab === tab.name ? "white" : "#424f63"}
                style={tab.name === "MyWorkoutPlan" && styles.specialIcon}
              />
            </TouchableOpacity>
          )
        )
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.115,
    backgroundColor: "#0f1924",
    borderTopLeftRadius: width * 0.4,
    borderTopRightRadius: width * 0.4,
    elevation: 5,
    position: "absolute",
    bottom: 0,
    paddingBottom: height * 0.02,
    width: "135%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.3,
    shadowRadius: height * 0.007,
  },
  tabButton: {
    alignItems: "center",
    width: width * 0.2,
    marginHorizontal: height * -0.002,
  },
  specialTabButton: {
    backgroundColor: "#1a2c40",
    borderRadius: width * 0.15,
    padding: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  specialIcon: {
    color: "#c5cfdb",
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
