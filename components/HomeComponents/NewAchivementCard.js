import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import useExerciseTracking from "../../hooks/useExerciseTracking";
import { RFValue } from "react-native-responsive-fontsize";

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
    <View
      style={{
        display: "flex",
        width: "40%",
        backgroundColor: "#0d2540",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: height * 0.02,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
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
                fontFamily: "PoppinsBold",
                fontSize: RFValue(13),
              }}
            >
              Personal Record
            </Text>
            <Image
              source={require("../../assets/gold-medal.png")}
              style={{ height: "50%", width: "50%" }}
            ></Image>
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
                fontSize: RFValue(16),
                marginTop: height * 0.0,
                fontFamily: "PoppinsBold",
              }}
            >
              {prExcersice}
            </Text>
            <Text
              style={{
                color: "white",
                fontFamily: "PoppinsRegular",
                fontSize: RFValue(13),
              }}
            >
              {prWeight} kg
            </Text>
            <Text
              style={{
                color: "white",
                fontFamily: "PoppinsRegular",
                fontSize: RFValue(13),
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
          }}
        >
          <Image
            source={require("../../assets/gold-medal.png")}
            style={{ height: height * 0.12, width: height * 0.12 }}
          ></Image>
          <Text
            style={{
              fontFamily: "PoppinsBold",
              color: "white",
              fontSize: RFValue(8),
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
