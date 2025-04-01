import React from "react";
import { Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { formatDate } from "../../utils/statisticsUtils";

const LastWorkoutSection = ({ lastWorkoutDate }) => {
  console.log(lastWorkoutDate);
  return (
    <View
      style={{
        flex: 1,
        width: "80%",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          color: "#1A1A1A",
          opacity: 0.7,
          fontSize: RFValue(14),
        }}
      >
        Last workout at: {formatDate(lastWorkoutDate)}
      </Text>
    </View>
  );
};

export default LastWorkoutSection;
