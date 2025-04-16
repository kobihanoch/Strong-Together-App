import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GradientedGoToButton = ({
  gradientColors,
  borderRadius,
  onPress,
  title,
  children,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.buttonContainer, { opacity: disabled ? 0.5 : 1 }]}
      pointerEvents={disabled ? "none" : "auto"}
    >
      <LinearGradient
        colors={gradientColors}
        style={[styles.gradientButton, { borderRadius }]}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientButton: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default GradientedGoToButton;
