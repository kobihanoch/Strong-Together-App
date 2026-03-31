import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, TextStyle, Text, StyleSheet } from 'react-native';

interface NumberCounterProps {
  numStart?: number;
  numEnd: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
}

const NumberCounter: React.FC<NumberCounterProps> = ({ numStart = 0, numEnd, duration = 2000, style }) => {
  const anim = useRef(new Animated.Value(numStart)).current;
  const [displayValue, setDisplayValue] = React.useState(`${Math.floor(numStart)} %`);

  useEffect(() => {
    const listenerId = anim.addListener((v) => {
      setDisplayValue(`${Math.floor(v.value)} %`);
    });

    Animated.timing(anim, {
      toValue: numEnd,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      anim.removeListener(listenerId);
      anim.stopAnimation();
    };
  }, [numEnd, duration, anim]);

  return (
    <Text style={[styles.defaultStyle, style]}>{displayValue}</Text>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
    textAlign: 'center',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
});

export default NumberCounter;
