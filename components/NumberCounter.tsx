import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const NumberCounter = ({ numStart = 0, numEnd, duration = 2000, style }) => {
  const inputRef = useRef(null);
  const anim = useRef(new Animated.Value(numStart)).current;

  useEffect(() => {
    const sub = anim.addListener(({ value }) => {
      const n = Number(value).toFixed(0);
      inputRef.current?.setNativeProps({ text: String(n) });
    });

    Animated.timing(anim, {
      toValue: numEnd,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // text prop update is layout-bound
    }).start();

    return () => anim.removeListener(sub);
  }, [numEnd, duration, anim]);

  return (
    <TextInput
      ref={inputRef}
      editable={false}
      caretHidden
      pointerEvents="none"
      underlineColorAndroid="transparent"
      // critical: keep width stable and center the text
      style={[
        style,
        {
          // fixed-width numerals -> no width wobble
          fontVariant: ["tabular-nums"],
          fontFeatureSettings: "'tnum'",
          includeFontPadding: false,
          textAlign: "center",
          // don't stretch across the Row
          flex: undefined,
          // avoid accidental background blends
          backgroundColor: "transparent",
        },
      ]}
    />
  );
};

export default NumberCounter;
