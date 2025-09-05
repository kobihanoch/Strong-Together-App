import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import CalendarStripCustom from "../components/StatisticsComponents/CalenderStripCustom";
import CardioSection from "../components/StatisticsComponents/CardioSection";
import ExercisesFlatList from "../components/StatisticsComponents/ExercisesFlatList";
import TabSelect from "../components/StatisticsComponents/TabSelect";
import WorkoutHeader from "../components/StatisticsComponents/workoutHeader";
import { useAuth } from "../context/AuthContext";
import useStatisticsPageLogic from "../hooks/logic/useStatisticsPageLogic";
import Row from "../components/Row";
import {
  GlobalAppLoadingProvider,
  useGlobalAppLoadingContext,
} from "../context/GlobalAppLoadingContext";

const { width, height } = Dimensions.get("window");

const StatisticsPage = () => {
  const { user } = useAuth();
  const {
    selectedDate,
    setSelectedDate,
    exerciseTrackingByDate, // Workout for date X
    exerciseTrackingByDatePrev, // Array of all last performences of all exercises
    exerciseTrackingWithDateKey, // Map of [date] => [...exercisetracking logs]
    cardioByDate, // Cardio for date X
  } = useStatisticsPageLogic(user);

  const { isLoading } = useGlobalAppLoadingContext();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(
      exerciseTrackingByDate && exerciseTrackingByDate.length
        ? 0
        : cardioByDate
        ? 1
        : 0
    );
  }, [exerciseTrackingByDate, cardioByDate]);

  if (isLoading) return null;

  return (
    <ScrollView style={styles.pageContainer}>
      <CalendarStripCustom
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
        userExerciseLogs={exerciseTrackingWithDateKey}
      />
      <TabSelect index={index} setIndex={setIndex}></TabSelect>
      <WorkoutHeader
        data={exerciseTrackingByDate}
        selectedDate={selectedDate}
      ></WorkoutHeader>
      {index === 0 ? (
        <ExercisesFlatList
          data={exerciseTrackingByDate}
          dataToCompare={exerciseTrackingByDatePrev || []}
          setIndex={setIndex}
        ></ExercisesFlatList>
      ) : (
        <CardioSection></CardioSection>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(17),
  },
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    paddingVertical: height * 0,
    paddingHorizontal: width * 0,
  },
});

export default StatisticsPage;
