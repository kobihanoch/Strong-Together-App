import React from "react";
import { View, Dimensions, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");
const Badge = ({ bg, color, label, style }) => {
  return (
    <View
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: 5,
          backgroundColor: bg,
          borderRadius: 15,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          color,
          fontSize: style.fontSize ? style.fontSize : RFValue(12),
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default Badge;
