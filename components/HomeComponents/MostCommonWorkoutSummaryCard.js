import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import useExerciseTracking from "../../hooks/useExerciseTracking";
import useWorkoutSplits from "../../hooks/useWorkoutSplits";

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
        flex: 3,
        height: "100%",
        borderRadius: height * 0.02,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      {mostFrequentSplit ? (
        <>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: width * 0.04,
                marginTop: height * 0.02,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: RFValue(12),
                  color: "black",
                }}
              >
                Common
              </Text>
            </View>

            <View
              style={{
                alignSelf: "center",
                marginTop: height * 0.015,
                borderWidth: width * 0.02,
                padding: height * 0.01,
                borderRadius: height * 0.08,
                borderColor: "#2979FF",
                justifyContent: "center",
                alignItems: "center",
                aspectRatio: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: RFValue(20),
                  color: "black",
                }}
              >
                {mostFreqWorkoutSplitName}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <Text>No records</Text>
      )}
    </View>
  );
};

export default MostCommonWorkoutSummaryCard;
