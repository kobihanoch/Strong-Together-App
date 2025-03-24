import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import useExerciseTracking from "../../hooks/useExerciseTracking";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      style={styles.workoutsContainer}
      colors={["#1e3c72", "#2a5298"]}
    >
      <View style={styles.workoutsContainer}>
        <View style={{ flexDirection: "column" }}>
          <Text
            style={{
              fontFamily: "PoppinsBold",
              color: "white",
              fontSize: RFValue(13),
            }}
          >
            Workout count
          </Text>
          <Text
            style={{
              fontFamily: "PoppinsRegular",
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
              fontFamily: "PoppinsBold",
              color: "#FACC15",
              fontSize: RFValue(18),
              alignSelf: "center",
            }}
          >
            {totalWorkoutsNumber}
          </Text>
        </View>
      </View>
    </LinearGradient>
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
