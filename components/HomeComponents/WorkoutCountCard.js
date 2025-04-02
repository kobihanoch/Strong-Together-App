import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");
function WorkoutCountCard({ totalWorkoutNumber }) {
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
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
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
              alignSelf: "center",
            }}
          >
            Workouts
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: RFValue(20),
            color: "black",
            alignSelf: "center",
            marginTop: height * 0.03,
          }}
        >
          {totalWorkoutNumber}
        </Text>
        <Text
          style={{
            fontSize: RFValue(10),
            color: "#666",
            alignSelf: "center",
            marginTop: height * 0.01,
          }}
        >
          Total workouts
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
