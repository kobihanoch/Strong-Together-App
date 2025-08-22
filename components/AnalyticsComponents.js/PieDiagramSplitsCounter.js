import React from "react";
import { Dimensions, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { PieChart } from "react-native-gifted-charts";
import { splitsCounterToPieData } from "../../utils/analyticsUtils";

const { width, height } = Dimensions.get("window");
const PieDiagramSplitsCounter = ({ splitsCounterWithColors, workoutCount }) => {
  return (
    <PieChart
      data={splitsCounterWithColors}
      donut
      radius={height * 0.1}
      innerRadius={height * 0.08}
      innerCircleColor={"#2979FF"}
      centerLabelComponent={() => (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              color: "white",
              fontSize: RFValue(25),
            }}
          >
            {workoutCount}
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              color: "white",
              fontSize: RFValue(12),
              marginTop: height * 0.02,
            }}
          >
            Total workouts
          </Text>
        </View>
      )}
    />
  );
};

export default PieDiagramSplitsCounter;
