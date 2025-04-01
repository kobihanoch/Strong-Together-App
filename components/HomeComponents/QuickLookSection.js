import React from "react";
import { Text, View, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import MostCommonWorkoutSummaryCard from "./MostCommonWorkoutSummaryCard";
import NewAchivementCard from "./NewAchivementCard";
import CreateOrEditWorkoutCard from "./CreateOrEditWorkoutCard";
import WorkoutCountCard from "./WorkoutCountCard";

const { width, height } = Dimensions.get("window");
const QuickLookSection = ({ user, hasAssignedWorkout, navigation }) => {
  return (
    <View
      style={{
        flex: 5,
        width: "85%",
        justifyContent: "center",
        flexDirection: "column",
        gap: height * 0.02,
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_700Bold",
          fontSize: RFValue(20),
        }}
      >
        Quick Look
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          height: "30%",
          gap: width * 0.02,
        }}
      >
        <MostCommonWorkoutSummaryCard
          userId={user?.id}
          height={height}
          width={width}
        />
        <MostCommonWorkoutSummaryCard
          userId={user?.id}
          height={height}
          width={width}
        />
        <MostCommonWorkoutSummaryCard
          userId={user?.id}
          height={height}
          width={width}
        />
      </View>
      <MostCommonWorkoutSummaryCard
        userId={user?.id}
        height={height}
        width={width}
      />
    </View>
  );
};

export default QuickLookSection;
