import React from "react";
import { Text, View, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import MostCommonWorkoutSummaryCard from "./MostCommonWorkoutSummaryCard";
import NewAchivementCard from "./NewAchivementCard";
import CreateOrEditWorkoutCard from "./CreateOrEditWorkoutCard";
import WorkoutCountCard from "./WorkoutCountCard";
import AnalyticsSection from "./AnalyticsSection";
import { Skeleton } from "moti/skeleton";

const { width, height } = Dimensions.get("window");
const QuickLookSection = ({ data, isLoading }) => {
  return (
    <Skeleton.Group show={isLoading}>
      <View
        style={{
          flex: 7,
          width: "85%",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: height * 0.01,
          marginTop: -20,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: RFValue(20),
            flex: 1,
          }}
        >
          Insights
        </Text>

        <Skeleton colorMode="light" height={140}>
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
        </Skeleton>

        <Skeleton colorMode="light" height={140}>
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
        </Skeleton>
        <Skeleton colorMode="light">
          <AnalyticsSection style={{ flex: 1 }}></AnalyticsSection>
        </Skeleton>
      </View>
    </Skeleton.Group>
  );
};

export default QuickLookSection;
