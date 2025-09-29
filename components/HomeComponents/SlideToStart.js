// English comments only
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const TRACK_WIDTH = width * 0.8;
const THUMB_SIZE = 60;
const MAX_X = TRACK_WIDTH - THUMB_SIZE;
const UNLOCK_THRESHOLD = MAX_X - 10;

const SlideToStart = ({ onUnlock }) => {
  // Thumb horizontal position
  const translateX = useSharedValue(0);
  // Stores position at gesture start (so movement is relative)
  const startX = useSharedValue(0);

  // Build a pan gesture (v4 API)
  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((e) => {
      // Clamp between 0..MAX_X
      const next = startX.value + e.translationX;
      translateX.value = Math.max(0, Math.min(MAX_X, next));
    })
    .onEnd(() => {
      if (translateX.value >= UNLOCK_THRESHOLD) {
        // Fire callback on JS thread
        runOnJS(onUnlock)();
      }
      // Snap back after releasing
      translateX.value = withSpring(0);
    });

  // Animated style for the thumb
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Wrap the whole track so the gesture is easy to grab */}
      <GestureDetector gesture={pan}>
        <View style={styles.track}>
          <Text style={styles.trackText}>Slide to start</Text>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <Text style={styles.arrow}>➤</Text>
          </Animated.View>
        </View>
      </GestureDetector>
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
  track: {
    width: TRACK_WIDTH,
    height: THUMB_SIZE,
    backgroundColor: "#ffffff34",
    borderRadius: 999,
    justifyContent: "center",
    overflow: "hidden",
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
  arrow: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
