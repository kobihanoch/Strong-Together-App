import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';

const pieces = [
  [8, '#21A366', -18], [17, '#2979FF', 14], [27, '#F2B84B', -10], [39, '#21A366', 20], [52, '#2979FF', -16],
  [64, '#F2B84B', 12], [75, '#21A366', -20], [86, '#2979FF', 18], [94, '#21A366', -12],
] as const;

/** A short, lightweight celebration burst that does not block interaction. */
const CelebrationConfetti = () => {
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 1500, useNativeDriver: true }).start();
  }, [progress]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map(([left, color, drift], index) => (
        <Animated.View
          key={`${left}-${color}`}
          style={[
            styles.piece,
            {
              left: `${left}%`,
              top: index % 2 ? 20 : 4,
              backgroundColor: color,
              opacity: progress.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] }),
              transform: [
                { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, drift] }) },
                { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-12, height * 0.42] }) },
                { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${drift * 18}deg`] }) },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({ piece: { position: 'absolute', width: 4, height: 13, borderRadius: 2 } });

export default CelebrationConfetti;
