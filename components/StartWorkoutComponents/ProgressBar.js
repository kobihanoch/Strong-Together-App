import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ProgressBar = ({ progress }) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: Math.min(progress / 10, 1),
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  let barColor = "#ff6b6b";
  let feedbackText = "Push harder";
  let IconComponent = MaterialCommunityIcons;
  let iconName = "alert-circle";

  if (progress >= 10) {
    barColor = "#4cd964";
    feedbackText = "Nice! You hit the target";
    IconComponent = MaterialCommunityIcons;
    iconName = "check-circle";
  } else if (progress >= 7.5) {
    barColor = "#ffa94d";
    feedbackText = "Almost there!";
    IconComponent = MaterialCommunityIcons;
    iconName = "progress-check";
  } else if (progress >= 5) {
    barColor = "#ffe066";
    feedbackText = "You can do better!";
    IconComponent = MaterialCommunityIcons;
    iconName = "alert-circle";
  }

  const animatedWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barFill,
            { width: animatedWidth, backgroundColor: barColor },
          ]}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: height * 0.01,
          gap: width * 0.02,
        }}
      >
        <IconComponent name={iconName} size={RFValue(15)} color={barColor} />
        <Text style={[styles.feedbackText, { color: barColor }]}>
          {feedbackText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  barBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: height * 0.02,
  },
  feedbackText: {
    fontSize: RFValue(13),
    fontFamily: "Inter_600SemiBold",
  },
});

export default ProgressBar;
