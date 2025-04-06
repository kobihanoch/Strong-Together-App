import React from "react";
import { Dimensions, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");
const HeaderSection = ({ user }) => {
  return (
    <View style={{ flex: 1.5, width: "90%", justifyContent: "flex-end" }}>
      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(25) }}>
        Hey {user?.name.split(" ")[0]}, {"\n"}
        <Text
          style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(25) }}
        >
          Ready to hit a workout?
        </Text>
      </Text>
    </View>
  );
};

export default HeaderSection;
