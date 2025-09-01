import React, { useCallback } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const TRACK_WIDTH = width * 0.8;
const THUMB_SIZE = 60;
const UNLOCK_THRESHOLD = TRACK_WIDTH - THUMB_SIZE - 10;

const SlideToStart = ({ onUnlock }) => {
  // Shared position of the thumb
  const translateX = useSharedValue(0);

  // Handle gesture
  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = Math.min(
        Math.max(0, event.translationX),
        TRACK_WIDTH - THUMB_SIZE
      );
    },
    onEnd: () => {
      if (translateX.value > UNLOCK_THRESHOLD) {
        runOnJS(onUnlock)();
        translateX.value = withSpring(0); // reset
      } else {
        translateX.value = withSpring(0); // snap back
      }
    },
  });

  // Animated style for thumb
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {/* Text under thumb */}
        <Text style={styles.trackText}>Slide to start</Text>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              ➤
            </Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

export default SlideToStart;

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  label: {
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 16,
    color: "white",
  },
  track: {
    width: TRACK_WIDTH,
    height: THUMB_SIZE,
    backgroundColor: "#ffffff34",
    borderRadius: 999,
    justifyContent: "center",
  },
  trackText: {
    position: "absolute",
    alignSelf: "center",
    color: "rgba(255, 255, 255, 0.34)",
    fontWeight: "500",
    fontSize: 15,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#2978ffff",
    justifyContent: "center",
    alignItems: "center",
  },
});
