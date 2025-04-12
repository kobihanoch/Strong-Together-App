import React from "react";
import { Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { formatDate } from "../../utils/statisticsUtils";
import { getDaysSince } from "../../utils/homePageUtils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const LastWorkoutSection = ({ data }) => {
  return (
    <View
      style={{
        flex: 1,
        width: "80%",
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          color: "#1A1A1A",
          opacity: 0.7,
          fontSize: RFValue(12),
        }}
      >
        <MaterialCommunityIcons
          name="clock"
          color="#1A1A1A"
          opacity={0.7}
        ></MaterialCommunityIcons>{" "}
        {data.exerciseTracking && data.exerciseTracking.length > 0
          ? "Last workout at: " +
            formatDate(data.lastWorkoutDate).split(",")[0] +
            "\n" +
            formatDate(data.lastWorkoutDate).split(",")[1].trim()
          : data.lastWorkoutDate}
      </Text>
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          color: "#1A1A1A",
          opacity: 0.7,
          fontSize: RFValue(12),
        }}
      >
        {data.exerciseTracking && data.exerciseTracking.length > 0
          ? getDaysSince(data.lastWorkoutDate)
          : ""}
      </Text>
    </View>
  );
};

export default LastWorkoutSection;
