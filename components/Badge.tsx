import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

interface BadgeProps {
  bg?: string;
  color?: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: StyleProp<ViewStyle> | any;
}

const Badge: React.FC<BadgeProps> = ({ bg, color, label, style = {} }) => {
  return (
    <View
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: 5,
          backgroundColor: bg,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: 'Inter_400Regular',
          color,
          fontSize: style?.fontSize ? style.fontSize : RFValue(12),
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default Badge;
