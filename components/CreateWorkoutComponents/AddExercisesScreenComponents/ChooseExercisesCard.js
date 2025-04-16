import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useCreateWorkout } from "../../../context/CreateWorkoutContext";
import ExerciseList from "./ExerciseList";
import MuscleTabs from "./MuscleTabs";

const { width, height } = Dimensions.get("window");

function ChooseExercisesCard() {
  const { properties, utils } = useCreateWorkout();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        borderRadius: width * 0.09,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: "column", flex: 3 }}>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: RFValue(16),
            color: "black",
            textAlign: "center",
            marginBottom: height * 0.02,
          }}
        >
          {properties.focusedSplit.name} Exercises
        </Text>

        <MuscleTabs />
      </View>

      <ExerciseList />

      <TouchableOpacity
        style={{
          backgroundColor: "#2979FF",
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
        }}
        onPress={() => properties.setCurrentStep(2)}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ChooseExercisesCard;
