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
    <LinearGradient
      colors={["rgb(92, 201, 134)", "rgb(0, 125, 100)"]}
      style={{
        flex: 6,
        width: "100%",
        borderRadius: height * 0.02,
        flexDirection: "column",
        justifyContent: "space-around",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.08,
      }}
    >
      {mostFrequentSplit ? (
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 4,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  color: "white",
                  fontSize: RFValue(13),
                }}
              >
                Most Common Workout
              </Text>
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  color: "white",
                  fontSize: RFValue(10),
                  opacity: 0.5,
                }}
              >
                Your most favourite workout
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "white",
                opacity: 0.4,
                height: height * 0.04,
                width: height * 0.04,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: height * 0.01,
              }}
            >
              <FontAwesome5 name="dumbbell"></FontAwesome5>
            </View>
          </View>

          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 6 }}
          >
            <Text
              style={{
                fontFamily: "PoppinsBold",
                color: "rgb(4, 67, 53)",
                fontSize: RFValue(45),
              }}
            >
              {mostFreqWorkoutSplitName}
            </Text>

            <Text
              style={{
                fontFamily: "PoppinsBold",
                color: "rgb(4, 67, 53)",
                marginTop: width * 0.02,
              }}
            >
              {mostFrequentWorkoutSplitMuscleGroup}
            </Text>
          </View>
        </>
      ) : (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.6,
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
    </LinearGradient>
  );
};

export default MostCommonWorkoutSummaryCard;
