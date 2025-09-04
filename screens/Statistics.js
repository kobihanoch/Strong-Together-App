import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import CalendarCard from "../components/StatisticsComponents/CalendarCard";
import ExercisesFlatList from "../components/StatisticsComponents/ExercisesFlatList";
import { useAuth } from "../context/AuthContext";
import useStatisticsPageLogic from "../hooks/logic/useStatisticsPageLogic";
import CalendarStripCustom from "../components/StatisticsComponents/CalenderStripCustom";
import { ScrollView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import TabsStrip from "../components/TabsStrip";
import SegmentedControl from "react-native-segmented-control-2";
import { colors } from "../constants/colors";
import Row from "../components/Row";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TabSelect from "../components/StatisticsComponents/TabSelect";
import CardioSection from "../components/StatisticsComponents/CardioSection";

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

  const [index, setIndex] = useState(0);

  return (
    <ScrollView style={styles.pageContainer}>
      <Text style={styles.header}>Catch up with your statistics</Text>
      <CalendarStripCustom
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
        userExerciseLogs={exerciseTrackingWithDateKey}
      />
      <TabSelect index={index} setIndex={setIndex}></TabSelect>
      {index === 0 ? (
        <ExercisesFlatList
          data={exerciseTrackingByDate}
          dataToCompare={exerciseTrackingByDatePrev || []}
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
    paddingVertical: height * 0.12,
    paddingHorizontal: width * 0.03,
  },
});

export default StatisticsPage;
