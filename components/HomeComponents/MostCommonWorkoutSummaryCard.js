import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import useWorkoutSplits from "../../hooks/useWorkoutSplits";
import useExerciseTracking from "../../hooks/useExerciseTracking";

const MostCommonWorkoutSummaryCard = ({
  userId,
  height,
  width,
  onStartWorkout,
}) => {
  const [
    mostFrequentWorkoutSplitMuscleGroup,
    setMostFrequentWorkoutSplitMuscleGroup,
  ] = useState(null);

  // Fetch functions from hooks
  const { fetchWorkoutSplit } = useWorkoutSplits();
  const { mostFrequentSplit, loading, error } = useExerciseTracking(userId);

  // Extract workout split ID and name from mostFrequentSplit
  const {
    workoutsplit_id: mostFreqWorkoutsplit_id,
    splitname: mostFreqWorkoutSplitName,
  } = mostFrequentSplit || {};

  // Fetch the most frequent workout split's muscle group when its ID changes
  useEffect(() => {
    if (!mostFreqWorkoutsplit_id) return;

    fetchWorkoutSplit(mostFreqWorkoutsplit_id).then((splitData) => {
      console.log("Fetched Workout Split Data:", splitData);
      if (splitData) {
        setMostFrequentWorkoutSplitMuscleGroup(splitData.muscle_group);
      }
    });
  }, [mostFreqWorkoutsplit_id]);

  return (
    <View
      style={{
        flex: 6,
        width: "100%",
        backgroundColor: "rgb(46, 84, 255)",
        borderRadius: height * 0.02,
        flexDirection: "column",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        gap: height * 0.0,
      }}
    >
      {mostFrequentSplit ? (
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: width * 0.05,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "PoppinsBold",
                color: "white",
                fontSize: RFValue(12),
                width: "70%",
              }}
            >
              Most common workout
            </Text>

            <TouchableOpacity
              style={{
                width: "30%",
                height: "70%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: height * 0.02,
                overflow: "hidden",
              }}
            >
              <LinearGradient
                colors={["rgb(15, 131, 255)", "rgb(101, 155, 255)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: height * 0.02,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: height * 0.006,
                  }}
                >
                  <FontAwesome5 name="dumbbell" color="white" opacity="0.8" />
                  <Text
                    style={{
                      fontSize: RFValue(8),
                      color: "white",
                      opacity: 0.8,
                    }}
                  >
                    Start
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontFamily: "PoppinsBold",
              color: "#0d2540",
              opacity: 1,
              fontSize: RFValue(35),
              marginHorizontal: width * 0.05,
            }}
          >
            {mostFreqWorkoutSplitName}
          </Text>

          <Text
            style={{
              fontFamily: "PoppinsBold",
              color: "#0d2540",
              opacity: 0.9,
              marginHorizontal: width * 0.05,
            }}
          >
            {mostFrequentWorkoutSplitMuscleGroup}
          </Text>
        </>
      ) : (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "PoppinsBold",
              color: "white",
              fontSize: RFValue(12),
            }}
          >
            No workouts yet
          </Text>
        </View>
      )}
    </View>
  );
};

export default MostCommonWorkoutSummaryCard;
