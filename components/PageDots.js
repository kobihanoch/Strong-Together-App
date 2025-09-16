import React from "react";
import { View, Animated } from "react-native";

const PageDots = ({
  index = 0,
  length = 0,
  activeColor = "#111",
  inactiveColor = "#111",
  fillColor, // optional: custom color for filled dots before the index
  fillToIndex = false,
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
        // Is the current dot considered "active" (highlighted)?
        const active = fillToIndex ? i <= clampedIndex : i === clampedIndex;

        // Determine which color to use
        let color = inactiveColor;
        if (active) {
          if (fillToIndex && fillColor && i < clampedIndex) {
            color = fillColor; // filled before current index
          } else {
            color = activeColor; // current index or fallback
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
