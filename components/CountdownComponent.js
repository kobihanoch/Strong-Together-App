// CountdownComponent.js
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const CountdownComponent = ({ countdownValue, onCountdownEnd }) => {
  const countdownScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (countdownValue > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(countdownScale, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(countdownScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [countdownValue]);

  return (
    <View style={styles.countdownContainer}>
      <Animated.Text
        style={[
          styles.countdownText,
          { transform: [{ scale: countdownScale }] },
        ]}
      >
        {countdownValue > 0 ? countdownValue : "START!"}
      </Animated.Text>
    </View>
  );
};

const styles = {
  countdownContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00142a",
    zIndex: 1,
  },
  countdownText: {
    fontSize: RFValue(80),
    color: "white",
    fontFamily: "Inter_700Bold",
  },
};

export default CountdownComponent;
