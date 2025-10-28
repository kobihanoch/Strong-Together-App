import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Skeleton } from "moti/skeleton";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useGlobalAppLoadingContext } from "../../context/GlobalAppLoadingContext";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { getBodyPartsForSplit } from "../../utils/homePageUtils";
import Badge from "../Badge";
import NumberCounter from "../NumberCounter";
import PercantageCircle from "../PercentageCircle";
import Row from "../Row";
import SlideToStart from "./SlideToStart";

const { width, height } = Dimensions.get("window");

const StartWorkoutCard = ({ data }) => {
  const { workoutSplits, workoutForEdit } = useWorkoutContext();
  const { isLoading } = useGlobalAppLoadingContext();
  const { mostFrequentSplit, totalWorkoutNumber, hasTracking } = data || {};
  const { hasTrainedToday = false } = useAnalysisContext() || {};
  const navigation = useNavigation();

  // English-only comments: Determine if we truly have enough data to render the "quick start" insights
  const hasData = useMemo(() => {
    if (isLoading) return false;
    if (!hasTracking) return false;
    if (!totalWorkoutNumber || totalWorkoutNumber <= 0) return false;
    if (!mostFrequentSplit?.splitName) return false;
    const splitExists = Array.isArray(workoutSplits)
      ? workoutSplits.some((ws) => ws?.name === mostFrequentSplit.splitName)
      : false;
    return splitExists;
  }, [
    isLoading,
    hasTracking,
    totalWorkoutNumber,
    mostFrequentSplit,
    workoutSplits,
  ]);

  const bodyPartsForMostFrqSplit = useMemo(() => {
    if (!hasData) return "";
    const filtered = workoutSplits?.filter(
      (ws) => ws.name === data?.mostFrequentSplit?.splitName
    );
    return getBodyPartsForSplit(filtered?.[0]);
  }, [workoutSplits, data, hasData]);

  const exCountForMostFrqSplit = useMemo(() => {
    if (!hasData) return 0;
    return workoutForEdit?.[data?.mostFrequentSplit?.splitName]?.length || 0;
  }, [workoutForEdit, data, hasData]);

  const progress = useMemo(() => {
    return hasData
      ? Math.round((mostFrequentSplit.times / totalWorkoutNumber) * 100)
      : 0;
  }, [hasData, mostFrequentSplit, totalWorkoutNumber]);

  return (
    <Skeleton.Group show={isLoading}>
      <View style={styles.bgWrapper}>
        {/* Cached background image (behind content) */}
        <Image
          source={require("../../assets/gymbg.png")}
          style={styles.bgImage}
          contentFit="cover"
          transition={300}
          cachePolicy="disk"
        />
        <LinearGradient
          colors={["#00000092", "#000000b6"]}
          style={styles.container}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "column", flex: 5 }}>
              <Text style={styles.header}>Quick Start</Text>

              {/* --- WHEN DATA EXISTS: show the usual insights --- */}
              {hasData ? (
                <>
                  <View style={{ marginTop: 35 }}>
                    <Skeleton
                      colors={[
                        "rgba(136, 136, 136, 1)",
                        "rgba(201, 201, 201, 1)",
                        "rgba(136, 136, 136, 1)",
                      ]}
                      width={80}
                    >
                      <Badge
                        bg="#2979ff"
                        color="#ffffffff"
                        label={"Split " + data?.mostFrequentSplit?.splitName}
                        style={[styles.badge]}
                      />
                    </Skeleton>
                  </View>

                  <View style={{ marginTop: 20 }}>
                    <Skeleton
                      colors={[
                        "rgba(136, 136, 136, 1)",
                        "rgba(201, 201, 201, 1)",
                        "rgba(136, 136, 136, 1)",
                      ]}
                    >
                      <Text style={styles.muscleGroupText}>
                        {bodyPartsForMostFrqSplit}
                      </Text>
                    </Skeleton>
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 10, gap: 8 }}>
                    <MaterialCommunityIcons
                      name={"whistle-outline"}
                      size={RFValue(13)}
                      color={"rgba(206, 206, 206, 0.86)"}
                    />
                    <Skeleton
                      colors={[
                        "rgba(136, 136, 136, 1)",
                        "rgba(201, 201, 201, 1)",
                        "rgba(136, 136, 136, 1)",
                      ]}
                      width={80}
                    >
                      <Text style={styles.exCount}>
                        {exCountForMostFrqSplit} exercises
                      </Text>
                    </Skeleton>
                  </View>
                </>
              ) : (
                /* --- EMPTY STATE: minimal, elegant and non-intrusive --- */
                <View style={{ marginTop: 24 }}>
                  {/* English-only comments: Dashed round placeholder with an icon to feel "alive" even without data */}
                  <View style={styles.emptyCircle}>
                    <MaterialCommunityIcons
                      name="dumbbell"
                      size={RFValue(22)}
                      color="rgba(255,255,255,0.85)"
                    />
                  </View>
                  <Text style={[styles.muscleGroupText, { marginTop: 20 }]}>
                    No history yet
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Create a plan and finish your first workout
                  </Text>
                </View>
              )}
            </View>

            {/* Right-side circle: only when data exists */}
            <View>
              {hasData ? (
                <Skeleton
                  colors={[
                    "rgba(136, 136, 136, 1)",
                    "rgba(201, 201, 201, 1)",
                    "rgba(136, 136, 136, 1)",
                  ]}
                  radius={"round"}
                >
                  <PercantageCircle
                    percent={progress}
                    fullColor="#dddddd4c"
                    actualColor="white"
                    size={80}
                    duration={2000}
                  >
                    <Row>
                      <NumberCounter
                        numStart={0}
                        numEnd={progress}
                        duration={2000}
                        style={styles.perText}
                      />
                      <Text style={styles.perText}>%</Text>
                    </Row>
                  </PercantageCircle>
                </Skeleton>
              ) : (
                // English-only comments: Keep right side balanced with an invisible spacer when empty
                <View style={{ width: 80, height: 80 }} />
              )}
            </View>
          </View>

          {/* Bottom: slide-to-start only if we have data; otherwise keep same vertical rhythm */}
          <View style={{ width: "100%" }}>
            {isLoading ? (
              <View style={{ height: 80 }} />
            ) : hasData ? (
              !hasTrainedToday ? (
                <SlideToStart
                  onUnlock={() => {
                    const target = workoutSplits.filter(
                      (s) => s.name === mostFrequentSplit.splitName
                    )[0];
                    if (target) {
                      navigation.navigate("StartWorkout", {
                        workoutSplit: target,
                      });
                    }
                  }}
                />
              ) : (
                <Text style={styles.alreadyTrainedText}>
                  Already trained today
                </Text>
              )
            ) : (
              // English-only comments: Gentle spacer to maintain layout height without adding actions that might confuse first-time users
              <View style={{ height: 20 }} />
            )}
          </View>
        </LinearGradient>
      </View>
    </Skeleton.Group>
  );
};

const styles = StyleSheet.create({
  bgWrapper: {
    width: "90%",
    alignSelf: "center",
    marginTop: height * 0.05,
    borderRadius: 15,
    overflow: "hidden", // critical for rounded corners on the image behind
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject, // fill the wrapper
    zIndex: -1, // stay behind content
  },
  container: {
    alignSelf: "center",
    width: "100%",
    paddingVertical: height * 0.03,
    paddingHorizontal: height * 0.02,
    alignItems: "flex-start",
    borderRadius: 15,
    flexDirection: "column",
  },
  header: {
    fontFamily: "Inter_600SemiBold",
    color: "white",
    fontSize: RFValue(15),
  },
  badge: {
    fontSize: RFValue(12),
  },
  muscleGroupText: {
    fontFamily: "Inter_500Medium",
    color: "white",
    fontSize: RFValue(20),
  },
  exCount: {
    fontFamily: "Inter_400Regular",
    color: "rgba(206, 206, 206, 0.86)",
    fontSize: RFValue(13),
  },
  perText: {
    fontFamily: "Inter_600SemiBold",
    color: "white",
    fontSize: RFValue(15),
  },
  alreadyTrainedText: {
    fontFamily: "Inter_600SemiBold",
    color: "white",
    fontSize: RFValue(15),
    textAlign: "center",
    marginTop: 40,
  },
  // --- Empty state styles ---
  emptyCircle: {
    // English-only comments: Visual anchor for empty state (subtle, elegant)
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  emptySubtext: {
    fontFamily: "Inter_400Regular",
    color: "rgba(230,230,230,0.85)",
    fontSize: RFValue(12.5),
    marginTop: 6,
  },
});

export default StartWorkoutCard;
