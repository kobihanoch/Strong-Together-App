import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, FlatList, Text, View, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import ExerciseCard from "./ExerciseCard";
import Column from "../Column";
import Row from "../Row";
import { Accordion } from "@animatereactnative/accordion";
import { colors } from "../../constants/colors";
import { formatDate } from "../../utils/statisticsUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StatsTable from "./StatsTable";
import RestDayCard from "./RestDayCard";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const ExerciseItem = ({ index, exData, lastPerformanceData }) => {
  const lastLogOfEx = useMemo(() => {
    if (lastPerformanceData) {
      const [last] = lastPerformanceData.filter(
        (ex) => ex.exercisetosplit_id === exData.exercisetosplit_id
      );
      if (last) return { lastReps: last.reps, lastWeight: last.weight };
    }
    return { lastReps: [], lastWeight: [] };
  }, [lastPerformanceData]);

  const { lastReps, lastWeight } = lastLogOfEx;

  const curReps = exData?.reps;
  const curWeight = exData?.weight;

  const rows = curWeight.map((_, i) => {
    const reps = curReps[i];
    const weight = curWeight[i];
    const prevR = lastReps[i];
    const prevW = lastWeight[i];
    return {
      setNo: i + 1,
      // Show empty string when missing, not 0
      reps: reps,
      repsDelta: reps - prevR, // null → pill not rendered
      weight: weight,
      weightDelta: weight - prevW, // null → pill not rendered
    };
  });

  return (
    <Accordion.Accordion style={styles.itemContainer}>
      <Accordion.Header>
        {/* This is your “tab” header */}
        <Row style={{ justifyContent: "space-between", width: "100%" }}>
          <Column style={{ gap: 10 }}>
            <Text style={styles.exerciseTitle}>{exData.exercise}</Text>
            <Text style={styles.pressableText}>Tap to toggle information</Text>
          </Column>
          <Accordion.HeaderIcon>
            <MaterialCommunityIcons
              name={"chevron-down"}
              size={RFValue(20)}
              color={"black"}
              paddingHorizontal={4}
              paddingVertical={4}
              borderRadius={10}
            />
          </Accordion.HeaderIcon>
        </Row>
      </Accordion.Header>

      {/* Expanded content inside the tab */}
      <Accordion.Expanded style={{ marginTop: 20 }}>
        {/* Your list / details */}
        <StatsTable rows={rows}></StatsTable>
      </Accordion.Expanded>
    </Accordion.Accordion>
  );
};

const ExercisesFlatList = ({ data, dataToCompare }) => {
  const nav = useNavigation();
  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <ExerciseItem
          index={index}
          exData={item}
          lastPerformanceData={dataToCompare}
        ></ExerciseItem>
      );
    },
    [dataToCompare]
  );

  return data && data.length ? (
    <Column>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
        initialNumToRender={4}
        windowSize={5}
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        ItemSeparatorComponent={<Column style={{ height: 10 }}></Column>}
      />
    </Column>
  ) : (
    <RestDayCard
      onPlanPress={() => {
        nav.navigate("MyWorkoutPlan");
      }}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: "95%",
    alignSelf: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  exerciseTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(15),
  },
  pressableText: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(10),
    color: colors.textSecondary,
  },
});

export default ExercisesFlatList;
