/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, TextStyle } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

interface NumberCounterProps {
  numStart?: number;
  numEnd: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
}

const NumberCounter: React.FC<NumberCounterProps> = ({ numStart = 0, numEnd, duration = 2000, style }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRef = useRef<any>(null);
  const anim = useRef(new Animated.Value(numStart)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: numEnd,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => anim.removeAllListeners();
  }, [numEnd, duration, anim]);

  return (
    <TextInput
      ref={inputRef}
      editable={false}
      caretHidden
      pointerEvents="none"
      underlineColorAndroid="transparent"
      defaultValue={String(numStart)}
      style={[
        style,
        {
          fontVariant: ['tabular-nums'],
          // @ts-ignore - fontFeatureSettings
          fontFeatureSettings: "'tnum'",
          includeFontPadding: false,
          textAlign: 'center',
          flex: undefined,
          backgroundColor: 'transparent',
        },
      ]}
    />
  );
};

export default NumberCounter;
