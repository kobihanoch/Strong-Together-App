import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const { height } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PercantageCircle = ({
  style,
  // size and stroke are configurable; defaults mimic your previous sizing
  size = Math.round(height * 0.05),
  stroke = 6,
  percent = 0,
  // track vs actual stroke colors
  fullColor = "#E5E7EB",
  actualColor = "#2979FF",
  duration = 650,
  children,
}) => {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - clamped / 100);

  // Animate strokeDashoffset when percent/size/stroke change
  const animatedOffset = useRef(new Animated.Value(dashOffset)).current;
  useEffect(() => {
    Animated.timing(animatedOffset, {
      toValue: dashOffset,
      duration: duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // layout prop, must be false
    }).start();
  }, [dashOffset, animatedOffset]);

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        {/* Rotate -90 so progress starts at the top (12 o'clock) */}
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Track (full circle) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={fullColor}
            strokeWidth={stroke}
            fill="none"
          />
          {/* Actual progress */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={actualColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c} ${c}`}
            strokeDashoffset={animatedOffset}
            fill="none"
          />
        </G>
      </Svg>

      {/* Centered child overlay */}
      <View pointerEvents="none" style={styles.center}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Centers children inside the circle
  center: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PercantageCircle;
