import React, { useMemo, useEffect, useRef } from "react";
import { View, Text, Dimensions, StyleSheet, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { RFValue } from "react-native-responsive-fontsize";
import Badge from "../Badge";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { getBodyPartsForSplit } from "../../utils/homePageUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "expo-image";
import SlideToStart from "./SlideToStart";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "moti/skeleton";
import { useGlobalAppLoadingContext } from "../../context/GlobalAppLoadingContext";
import { colors } from "../../constants/colors";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width, height } = Dimensions.get("window");

const StartWorkoutCard = ({ data }) => {
  const { workoutSplits, workoutForEdit } = useWorkoutContext();
  const { isLoading } = useGlobalAppLoadingContext();
  const { mostFrequentSplit, totalWorkoutNumber, hasTracking } = data;
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

  const radius = width * 0.1;
  const strokeWidth = width * 0.02;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const progress = useMemo(
    () =>
      hasTracking && totalWorkoutNumber
        ? Math.min(mostFrequentSplit.times / totalWorkoutNumber, 1)
        : 0,
    [hasTracking, totalWorkoutNumber]
  );

  //console.log(mostFrequentSplit);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });
  return (
    <Skeleton.Group show={isLoading}>
      <ImageBackground
        source={require("../../assets/gymbg.png")}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 15 }}
      >
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

            <View
              style={{
                flexDirection: "column",
                flex: 2,
                alignSelf: "flex-start",
                marginTop: 5,
              }}
            >
              <View
                style={{
                  width: radius * 2,
                  height: radius * 2,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Skeleton
                  colors={[
                    "rgba(136, 136, 136, 1)",
                    "rgba(201, 201, 201, 1)",
                    "rgba(136, 136, 136, 1)",
                  ]}
                  radius={"round"}
                >
                  <Svg height={radius * 2} width={radius * 2}>
                    <Circle
                      stroke="#e6e6e654"
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      r={normalizedRadius}
                      cx={radius}
                      cy={radius}
                    />
                    <AnimatedCircle
                      stroke="#ffffffff"
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      r={normalizedRadius}
                      cx={radius}
                      cy={radius}
                      rotation="-90"
                      origin={`${radius}, ${radius}`}
                    />
                  </Svg>
                </Skeleton>
                <View
                  style={{
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(15),
                      color: "#ffffffff",
                    }}
                  >
                    {isLoading
                      ? ""
                      : hasTracking
                      ? Math.round(
                          Number(
                            mostFrequentSplit?.times / totalWorkoutNumber
                          ) * 100
                        ) + "%"
                      : 0 + "%"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Start slide */}
          <View style={{ width: "100%" }}>
            {isLoading || !hasTracking ? (
              <View style={{ height: 80 }}></View>
            ) : (
              <SlideToStart
                onUnlock={() => {
                  navigation.navigate("StartWorkout", {
                    workoutSplit: workoutSplits.filter(
                      (s) => s.name === mostFrequentSplit.splitName
                    )[0],
                  });
                }}
              />
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </Skeleton.Group>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 15,
    marginTop: height * 0.05,
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
});

export default StartWorkoutCard;
