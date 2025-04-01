import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import useExerciseTracking from "../../hooks/useExerciseTracking";

const { width, height } = Dimensions.get("window");

function NewAchivementCard({ user, hasAssignedWorkout }) {
  const { trackingData, loading, error } = useExerciseTracking(user?.id);
  const [prWeight, setPrWeight] = useState(0);
  const [prExcersice, setPrExercise] = useState(null);
  const [prReps, setPrReps] = useState(0);

  // Fetching PRS (Max weight, max exercise name of max weight, max reps of set of max weight)
  useEffect(() => {
    const PRS = {};
    let maxWeight = 0;
    let maxExercise = null;
    let maxReps = 0;
    trackingData.forEach((exerciseInTrackingData) => {
      const weightArr = exerciseInTrackingData.weight;
      const repsArr = exerciseInTrackingData.reps;
      const maxWeightInArray = Math.max(...weightArr);
      if (maxWeightInArray > maxWeight) {
        maxWeight = maxWeightInArray;
        maxExercise = exerciseInTrackingData.exercise;
        const index = weightArr.indexOf(maxWeightInArray);
        maxReps = repsArr[index];
      }
    });
    setPrWeight(maxWeight);
    setPrExercise(maxExercise);
    setPrReps(maxReps);
  }, [trackingData]);

  return (
    <View style={{ flex: 3, height: "100%" }}>
      {hasAssignedWorkout ? (
        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              flex: 6,
              justifyContent: "center",
              alignItems: "center",
              marginTop: height * 0.01,
              gap: height * 0.01,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontFamily: "Inter_700Bold",
                fontSize: RFValue(13),
              }}
            >
              Personal Record
            </Text>
            <View
              style={{
                shadowColor: "#FFD700",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.7,
                shadowRadius: 20,
                elevation: 20,
                alignItems: "center",
                justifyContent: "center",
                height: "50%",
                width: "50%",
              }}
            >
              <Image
                source={require("../../assets/gold-medal.png")}
                style={{ height: "100%", width: "100%" }}
              ></Image>
            </View>
          </View>
          <View
            style={{
              flex: 4,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: RFValue(12),
                marginTop: height * 0.0,
                fontFamily: "Inter_700Bold",
                opacity: 0.8,
              }}
            >
              {prExcersice}
            </Text>
            <Text
              style={{
                color: "white",
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(13),
                marginTop: height * 0.01,
                opacity: 0.8,
              }}
            >
              {prWeight} kg
            </Text>
            <Text
              style={{
                color: "white",
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(13),
                opacity: 0.8,
              }}
            >
              {" "}
              for {prReps} reps
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "column",
            gap: height * 0.02,
            opacity: 0.6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/gold-medal.png")}
            style={{ height: height * 0.12, width: height * 0.12 }}
          ></Image>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              color: "white",
              fontSize: RFValue(11),
              textAlign: "center",
            }}
          >
            No personal record yet
          </Text>
        </View>
      )}
    </View>
  );
}

export default NewAchivementCard;
