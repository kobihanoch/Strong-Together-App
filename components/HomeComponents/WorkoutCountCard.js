import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import useExerciseTracking from "../../hooks/useExerciseTracking";

function WorkoutCountCard({ userId, height, width }) {
  const { trackingData, loading, error } = useExerciseTracking(userId);

  const [totalWorkoutsNumber, setTotalWorkoutNumber] = useState(0);

  // Updating workout counter
  useEffect(() => {
    const uniWorkouts = new Set();
    trackingData.forEach((exerciseInTrackingData) => {
      uniWorkouts.add(exerciseInTrackingData.workoutdate);
    });
    setTotalWorkoutNumber(uniWorkouts.size);
  }, [trackingData]);

  const styles = createStyles(height, width);

  return (
    <View style={{ flex: 3, height: "100%" }}>
      <View style={styles.workoutsContainer}>
        <View style={{ flexDirection: "column" }}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              color: "white",
              fontSize: RFValue(13),
            }}
          >
            Workout count
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              color: "white",
              fontSize: RFValue(10),
              opacity: 0.5,
            }}
          >
            Your journy so far
          </Text>
        </View>
        <View style={{}}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              color: "#FACC15",
              fontSize: RFValue(18),
              alignSelf: "center",
            }}
          >
            {totalWorkoutsNumber}
          </Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (height, width) =>
  StyleSheet.create({
    workoutsContainer: {
      flex: 1,
      height: "100%",
      width: "90%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: height * 0.02,
      paddingHorizontal: width * 0.04,
      opacity: 1,
    },
  });

export default WorkoutCountCard;
