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
import { Image } from "expo-image";
import images from "../images";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const ExerciseItem = ({ index, exData, lastPerformanceData }) => {
  const mainMuscle = exData?.exercisetoworkoutsplit?.exercises?.targetmuscle;
  const specificMuscle =
    exData?.exercisetoworkoutsplit?.exercises?.specifictargetmuscle;
  const imagePath = images[mainMuscle]?.[specificMuscle];

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
        {/* Header */}
        <Row style={{ width: "100%", alignItems: "center" }}>
          {/* Left group: image + text */}
          <Row style={{ flex: 1, alignItems: "center", gap: 12 }}>
            <LinearGradient
              colors={["#fafafaff", "#f1f8ffff"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.imageContainer}
            >
              <Image
                source={imagePath}
                cachePolicy="disk"
                contentFit="contain" // keep proportions, no stretching
                style={{ width: "100%", height: "100%" }} // let the container size it
              />
            </LinearGradient>

            <Column style={{ flex: 1, gap: 6 }}>
              <Text style={styles.exerciseTitle} numberOfLines={1}>
                {exData.exercise}
              </Text>
              <Text style={styles.pressableText}>
                Tap to toggle information
              </Text>
            </Column>
          </Row>

          {/* Right: chevron */}
          <Accordion.HeaderIcon>
            <MaterialCommunityIcons
              name="chevron-down"
              size={RFValue(20)}
              color="black"
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

const ExercisesFlatList = ({ data, dataToCompare, setIndex }) => {
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
    backgroundColor: "#fff",
  },
  imageContainer: {
    height: height * 0.1, // square
    aspectRatio: 1,
    backgroundColor: colors.lightCardBg,
    padding: 12, // was 20; gives the image room
    borderRadius: 16,
    overflow: "hidden", // ensure rounded corners actually clip the image
  },
  exerciseTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(14),
    // optional: improve vertical rhythm
    lineHeight: RFValue(17),
  },
  pressableText: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(10),
    color: colors.textSecondary,
  },
});

export default ExercisesFlatList;
