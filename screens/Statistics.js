import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import CalendarCard from "../components/StatisticsComponents/CalendarCard";
import ExercisesFlatList from "../components/StatisticsComponents/ExercisesFlatList";
import { useAuth } from "../context/AuthContext";
import useStatisticsPageLogic from "../hooks/logic/useStatisticsPageLogic";

const { width, height } = Dimensions.get("window");

const StatisticsPage = () => {
  const { user } = useAuth();
  const {
    selectedDate,
    setSelectedDate,
    exerciseTrackingByDate,
    exerciseTrackingByDatePrev,
    exerciseTrackingWithDateKey,
  } = useStatisticsPageLogic(user);

  return (
    <View
      style={[
        styles.pageContainer,
        {
          flex: 6,
          borderRadius: height * 0.0,
          flexDirection: "column",
          paddingHorizontal: width * 0.05,
        },
      ]}
    >
      <View
        style={{
          flex: 2.5,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CalendarCard
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          userExerciseLogs={exerciseTrackingWithDateKey || []}
        />
      </View>
      <View style={{ flex: 7.5 }}>
        <ExercisesFlatList
          data={exerciseTrackingByDate}
          dataToCompare={exerciseTrackingByDatePrev || []}
        ></ExercisesFlatList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingVertical: height * 0.03,
    flexDirection: "column",
  },
  contentContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StatisticsPage;
