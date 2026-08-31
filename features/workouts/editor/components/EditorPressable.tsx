import React, { PropsWithChildren, useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Small press feedback shared by the editor's main controls.
const EditorPressable = ({ children, style, ...props }: PropsWithChildren<Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle> }>) => {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (value: number) => Animated.timing(scale, { toValue: value, duration: 90, useNativeDriver: true }).start();

  return (
    <AnimatedPressable {...props} style={[style, { transform: [{ scale }] }]} onPressIn={() => animate(0.985)} onPressOut={() => animate(1)}>
      {children}
    </AnimatedPressable>
  );
};

export default EditorPressable;
