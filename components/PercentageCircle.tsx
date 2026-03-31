/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { ReactNode, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const { height } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type PercantageCircleProps = {
  style?: ViewStyle | ViewStyle[];
  size?: number;
  stroke?: number;
  percent?: number;
  fullColor?: string;
  actualColor?: string;
  duration?: number;
  children?: ReactNode;
};

const PercantageCircle = ({
  style,
  size = Math.round(height * 0.05),
  stroke = 6,
  percent = 0,
  fullColor = '#E5E7EB',
  actualColor = '#2979FF',
  duration = 650,
  children,
}: PercantageCircleProps) => {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - clamped / 100);

  const animatedOffset = useRef(new Animated.Value(c)).current;

  useEffect(() => {
    Animated.timing(animatedOffset, {
      toValue: dashOffset,
      duration: duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return () => {
      animatedOffset.stopAnimation();
    };
  }, [dashOffset, duration, animatedOffset]);

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={fullColor} strokeWidth={stroke} fill="none" />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={actualColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c} ${c}`}
            // @ts-ignore
            strokeDashoffset={animatedOffset}
            fill="none"
          />
        </G>
      </Svg>

      <View pointerEvents="none" style={styles.center}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PercantageCircle;
