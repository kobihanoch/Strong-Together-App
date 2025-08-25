// English comments only inside the code

import React from "react";
import { View, Animated } from "react-native";

const PageDots = ({ index, length }) => {
  return (
    <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 8 }}>
      {Array.from({ length }).map((_, i) => {
        const active = i === index;
        return (
          <Animated.View
            key={i}
            style={{
              width: active ? 10 : 8,
              height: active ? 10 : 8,
              borderRadius: 999,
              backgroundColor: "#111",
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
