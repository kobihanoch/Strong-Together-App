import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const ProgressBar = ({ progress }) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: Math.min(progress / 10, 1),
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  let barColor = "#ff4d4d";
  let feedbackText = "Push harder 💪";

  if (progress >= 10) {
    barColor = "#4cd964";
    feedbackText = "Nice! You hit the target 🎯";
  } else if (progress >= 7.5) {
    barColor = "#ffd60a";
    feedbackText = "Almost there! ⏱️";
  } else if (progress >= 5) {
    barColor = "#ff9500";
    feedbackText = "You can do better! 🔥";
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
      <Text style={[styles.feedbackText, { color: barColor }]}>
        {feedbackText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
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
    borderRadius: 10,
  },
  feedbackText: {
    marginTop: 8,
    fontSize: RFValue(13),
    fontFamily: "Inter_400Regular",
  },
});

export default ProgressBar;
