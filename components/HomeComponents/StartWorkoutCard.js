import React, { useMemo, useEffect, useRef } from "react";
import { View, Text, Dimensions, StyleSheet, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { RFValue } from "react-native-responsive-fontsize";
import Badge from "../Badge";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { getBodyPartsForSplit } from "../../utils/homePageUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ImageBackground } from "expo-image";
import SlideToStart from "./SlideToStart";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "moti/skeleton";
import { useGlobalAppLoadingContext } from "../../context/GlobalAppLoadingContext";
import { colors } from "../../constants/colors";
import { useAnalysisContext } from "../../context/AnalysisContext";
import PercantageCircle from "../PercentageCircle";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width, height } = Dimensions.get("window");

const StartWorkoutCard = ({ data }) => {
  const { workoutSplits, workoutForEdit } = useWorkoutContext();
  const { isLoading } = useGlobalAppLoadingContext();
  const { mostFrequentSplit, totalWorkoutNumber, hasTracking } = data;
  const { hasTrainedToday = false } = useAnalysisContext() || {};
  const navigation = useNavigation();

  const bodyPartsForMostFrqSplit = useMemo(() => {
    if (!workoutSplits || !data || !hasTracking) return "No data";
    const filtered = workoutSplits?.filter(
      (ws) => ws.name === data?.mostFrequentSplit?.splitName
    );
    return getBodyPartsForSplit(filtered[0]);
  }, [workoutSplits, data, hasTracking]);

  const exCountForMostFrqSplit = useMemo(() => {
    if (!workoutForEdit || !data || !hasTracking) return 0;
    return workoutForEdit[data?.mostFrequentSplit?.splitName]?.length;
  }, [workoutForEdit, data, hasTracking]);

  const progress = useMemo(
    () =>
      hasTracking && totalWorkoutNumber
        ? Math.round((mostFrequentSplit.times / totalWorkoutNumber) * 100)
        : 0,
    [hasTracking, totalWorkoutNumber]
  );

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
                    label={
                      isLoading
                        ? ""
                        : hasTracking
                        ? "Split " + data?.mostFrequentSplit?.splitName
                        : ""
                    }
                    style={[styles.badge, { opacity: hasTracking ? 1 : 0 }]}
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
            </View>
            {/* Circle */}

            <View style={{}}>
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
                  size={70}
                >
                  <Text style={styles.perText}>{progress}%</Text>
                </PercantageCircle>
              </Skeleton>
            </View>
          </View>

          {/* Start slide */}
          <View style={{ width: "100%" }}>
            {isLoading || !hasTracking ? (
              <View style={{ height: 80 }}></View>
            ) : !hasTrainedToday ? (
              <SlideToStart
                onUnlock={() => {
                  navigation.navigate("StartWorkout", {
                    workoutSplit: workoutSplits.filter(
                      (s) => s.name === mostFrequentSplit.splitName
                    )[0],
                  });
                }}
              />
            ) : (
              <Text style={styles.alreadyTrainedText}>
                Already trained today
              </Text>
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
});

export default StartWorkoutCard;
