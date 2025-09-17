import React from "react";
import { View, Animated } from "react-native";

const PageDots = ({
  index = 0,
  length = 0,
  // Page indexing
  activeColor = "#111", // Active index color
  inactiveColor = "#111", // Inactive color
  // Progress
  fillColor, // Custom color for filled dots before the index
  fillToIndex = false, // Fill colors until index (true/false)
  fillAll = false, // Fill all dots (if completed)
  style,
}) => {
  // Clamp index to valid range
  const clampedIndex = Math.max(0, Math.min(length - 1, index));

  return (
    <View
      style={[
        { flexDirection: "row", alignSelf: "center", marginTop: 8 },
        style,
      ]}
    >
      {Array.from({ length }).map((_, i) => {
        // All dots active if fillAll is true
        const active = fillAll
          ? true
          : fillToIndex
          ? i <= clampedIndex
          : i === clampedIndex;

        // Determine which color to use
        let color = inactiveColor;

        if (active) {
          if (fillAll && fillColor) {
            color = fillColor; // all dots same color
          } else if (fillToIndex && fillColor && i < clampedIndex) {
            color = fillColor; // dots before index
          } else {
            color = activeColor; // current index
          }
        }

        return (
          <Animated.View
            key={i}
            style={{
              width: active ? 10 : 8,
              height: active ? 10 : 8,
              borderRadius: 999,
              backgroundColor: color,
              opacity: active ? 1 : 0.4,
              marginHorizontal: 4,
            }}
          />
        );
      })}
    </View>
  );
};

export default PageDots;
