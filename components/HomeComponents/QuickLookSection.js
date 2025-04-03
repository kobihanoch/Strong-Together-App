import React from "react";
import { Text, View, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import MostCommonWorkoutSummaryCard from "./MostCommonWorkoutSummaryCard";
import NewAchivementCard from "./NewAchivementCard";
import CreateOrEditWorkoutCard from "./CreateOrEditWorkoutCard";
import WorkoutCountCard from "./WorkoutCountCard";

const { width, height } = Dimensions.get("window");
const QuickLookSection = ({ data, navigation }) => {
  return (
    <View
      style={{
        flex: 6,
        width: "85%",
        justifyContent: "flex-start",
        flexDirection: "column",
        gap: height * 0.01,
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_700Bold",
          fontSize: RFValue(20),
          flex: 1,
        }}
      >
        Insights
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: width * 0.02,
          flex: 4.5,
        }}
      >
        <MostCommonWorkoutSummaryCard
          totalWorkoutNumber={data.totalWorkoutNumber}
          mostFrequentSplit={data.mostFrequentSplit}
        />
        <WorkoutCountCard
          totalWorkoutNumber={data.totalWorkoutNumber}
        ></WorkoutCountCard>
        <CreateOrEditWorkoutCard
          hasAssignedWorkout={data.hasAssignedWorkout}
        ></CreateOrEditWorkoutCard>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          flex: 4.5,
          gap: width * 0.02,
        }}
      >
        <NewAchivementCard
          PR={data.PR}
          hasAssignedWorkout={data.hasAssignedWorkout}
        ></NewAchivementCard>
      </View>
    </View>
  );
};

export default QuickLookSection;
