// English comments only inside the code
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useMyWorkoutPlanPageLogic } from "../../hooks/logic/useMyWorkoutPlanPageLogic";
import { getBodyPartsForSplit } from "../../utils/homePageUtils";
import Badge from "../Badge";
import Column from "../Column";
import PageDots from "../PageDots";
import Row from "../Row";
import StartWorkoutButton from "./StartWorkoutButton";
import StartCardioButton from "./StartCardioButton";

const { width, height } = Dimensions.get("window");

const SplitFlatList = ({
  setSelectedSplit,
  selectedSplit,
  openCardioModal,
}) => {
  const { workoutSplits, exerciseCounter } = useMyWorkoutPlanPageLogic();
  const { hasTrainedToday, analyzedExerciseTrackingData } =
    useAnalysisContext();

  const splitDaysCompletions = useMemo(
    () => analyzedExerciseTrackingData?.splitDaysByName ?? {},
    [analyzedExerciseTrackingData]
  );

  // Page width for FlatList paging
  const [pageW, setPageW] = useState(0);
  const [curPageIndex, setCurPageIndex] = useState(0);

  const renderItem = useCallback(
    ({ item }) => {
      const musclesText = (item?.muscleGroup || "")
        .replace(/\s*\([^)]*\)/g, "")
        .trim();

      const exCount = exerciseCounter?.[item.name] ?? 0;
      const completions = splitDaysCompletions?.[item.name] ?? 0;

      return (
        <View style={[styles.cardWrapper, { width: pageW }]}>
          {/* Top row: Title + subtle pill */}
          <Row style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                Workout <Text style={styles.titleAccent}>{item.name}</Text>
              </Text>
              <Text style={styles.subtitle}>Your preset split for today</Text>
            </View>

            {/* Small soft tag at the corner */}
            <View style={styles.softTag}>
              <MaterialCommunityIcons
                name="lightning-bolt-outline"
                size={RFValue(12)}
                color="#fff"
              />
              <Text style={styles.softTagText}>Ready</Text>
            </View>
          </Row>

          {/* Chips row */}
          <Row style={styles.chipsRow}>
            <Badge
              bg="#2979FF"
              color="#FFFFFF"
              label={getBodyPartsForSplit(item)}
              style={styles.badgeText}
            />
          </Row>

          {/* Muscles list (multi-line, airy line-height) */}
          <Text style={styles.muscles}>{musclesText}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Stats grid */}
          <Row style={styles.statsRow}>
            <Column style={styles.statBox}>
              <Row style={styles.statHeader}>
                <MaterialCommunityIcons
                  name="whistle-outline"
                  size={RFValue(14)}
                  color="#FFFFFF"
                />
                <Text style={styles.statLabel}>Exercises</Text>
              </Row>
              <Text style={styles.statValue}>{exCount}</Text>
            </Column>

            <View style={styles.vSeparator} />

            <Column style={styles.statBox}>
              <Row style={styles.statHeader}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={RFValue(14)}
                  color="#FFFFFF"
                />
                <Text style={styles.statLabel}>Completions</Text>
              </Row>
              <Text style={styles.statValue}>× {completions}</Text>
            </Column>
          </Row>
        </View>
      );
    },
    [pageW, exerciseCounter, splitDaysCompletions]
  );

  const handleScroll = useCallback(
    (e) => {
      const x = e.nativeEvent.contentOffset.x;
      const page = Math.round(x / pageW);
      const item = workoutSplits?.[page];
      setSelectedSplit(item);
      setCurPageIndex(page);
    },
    [pageW, workoutSplits, setSelectedSplit]
  );

  return (
    <View style={{ height: "100%" }}>
      <Image
        source={require("../../assets/workoutplanbg.png")}
        style={styles.bgImage}
        contentFit="cover"
        cachePolicy="disk"
        transition={200}
      />

      {/* Foreground overlay + content */}
      <LinearGradient colors={["#0A0A0A70", "#0A0A0AD8"]} style={styles.card}>
        <FlatList
          data={workoutSplits}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          style={{ flex: 1 }}
          onLayout={(e) => setPageW(e.nativeEvent.layout.width)}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
        />
        {/* CTA */}
        <Column style={{ gap: 20 }}>
          <StartWorkoutButton
            hasTrainedToday={hasTrainedToday}
            selectedSplit={selectedSplit}
          ></StartWorkoutButton>
          <StartCardioButton openCardioModal={openCardioModal} />
        </Column>

        {/* Page Indicator */}
        <PageDots
          index={curPageIndex}
          length={workoutSplits?.length}
          activeColor="white"
          inactiveColor="#ffffff7f"
          style={{ marginTop: height * 0.035, marginBottom: height * 0.2 }}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  // Card wrapper with rounded clip
  cardWrapper: {
    overflow: "hidden",
    flexDirection: "column",
    gap: 10,
  },

  // Absolute background image
  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },

  // Foreground gradient container
  card: {
    flex: 1,
    borderRadius: 16,
    paddingTop: height * 0.12,
    paddingHorizontal: width * 0.05,
    justifyContent: "space-between",
  },

  // Top row
  topRow: {
    alignItems: "flex-start",
  },

  // Title + accent number/letter
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(22),
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  titleAccent: {
    color: "#FFFFFF",
    opacity: 0.9,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "rgba(230,230,230,0.85)",
    marginTop: 4,
    letterSpacing: 0.2,
  },

  // Soft tag (small rounded pill)
  softTag: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  softTagText: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(11),
    color: "#FFFFFF",
  },

  // Chips row
  chipsRow: {
    marginTop: height * 0.015,
  },
  badgeText: {
    fontSize: RFValue(12),
  },

  // Muscles multi-line
  muscles: {
    marginTop: height * 0.01,
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(13.5),
    lineHeight: RFValue(18),
    color: "#FFFFFF",
    opacity: 0.95,
  },

  // Divider
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginTop: height * 0.03,
    marginBottom: height * 0.012,
  },

  // Stats grid
  statsRow: {
    alignItems: "center",
  },
  statBox: {
    flex: 1,
  },
  statHeader: {
    alignItems: "center",
    gap: 8,
  },
  statLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(12),
    color: "#FFFFFF",
    opacity: 0.9,
  },
  statValue: {
    marginTop: 6,
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(18),
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  vSeparator: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.14)",
    marginHorizontal: 14,
  },
});

export default SplitFlatList;
