import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import useExerciseTracking from "../../hooks/useExerciseTracking";
import { RFValue } from "react-native-responsive-fontsize";

function WorkoutCountCard({ userId, height, width }) {
  const {
    trackingData: exerciseTrackingData,
    loading,
    error,
  } = useExerciseTracking(userId ?? null);

  const uniqueDates = new Set();

  exerciseTrackingData.forEach((item) => {
    const date = new Date(item.workoutdate).toDateString();
    uniqueDates.add(date);
  });

  const totalWorkoutsNumber = uniqueDates.size;

  const styles = createStyles(height, width);

  return (
    <View style={styles.workoutsContainer}>
      <Text
        style={{
          fontFamily: "PoppinsRegular",
          color: "#7d9bbd",
          fontSize: RFValue(13),
        }}
      >
        Your workout count is
      </Text>
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
  );
}

const createStyles = (height, width) =>
  StyleSheet.create({
    workoutsContainer: {
      backgroundColor: "#0d2540",
      height: "100%",
      width: "90%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: height * 0.02,
      paddingHorizontal: width * 0.08,
    },
  });

export default WorkoutCountCard;
