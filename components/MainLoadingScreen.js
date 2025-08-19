// components/MainLoadingScreen.js (בלי moti)
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const MESSAGES = [
  "Checking session…",
  "Loading profile…",
  "Syncing workouts…",
  "Almost ready…",
];

const MainLoadingScreen = () => {
  const [idx, setIdx] = useState(0);

  // Pulse + slight rotate
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current; // 0..1 -> 0..5deg
  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.08,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Fake progress
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0.85,
      duration: 2500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  // Rotate interpolation
  const rotateDeg = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "5deg"],
  });
  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // Change status message
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0A66D6", "#2E7BEA", "#4FA0FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.Image
        source={require("../assets/logo_512.png")}
        style={[styles.logo, { transform: [{ scale }, { rotate: rotateDeg }] }]}
        resizeMode="contain"
      />

      <Text style={styles.message}>{MESSAGES[idx]}</Text>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: widthInterpolate }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: { width: 160, height: 160, marginBottom: 50 },
  message: {
    fontFamily: "Inter_500Medium",
    fontSize: 20,
    color: "white",
    marginBottom: 15,
  },
  track: {
    width: 200,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: "white", borderRadius: 999 },
});

export default React.memo(MainLoadingScreen);
