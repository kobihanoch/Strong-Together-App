import React from "react";
import { View, Text, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ChooseExercisesCard from "../AddExercisesScreenComponents/ChooseExercisesCard";
import GradientedGoToButton from "../../GradientedGoToButton";
import { useState } from "react";

const { width, height } = Dimensions.get("window");

function AddExercisesScreen({
  setStep,
  workoutSplitName,
  exercises,
  setSelectedExercisesBySplit,
  selectedExercisesBySplit,
}) {
  const initialSelectedExercises =
    selectedExercisesBySplit[workoutSplitName] || [];

  const handleSaveExercises = (splitName, selectedExercises) => {
    setSelectedExercisesBySplit((prev) => ({
      ...prev,
      [splitName]: Array.isArray(selectedExercises) ? selectedExercises : [],
    }));
    setStep(2);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: width * 0.05 }}>
      <View
        style={{
          flex: 1.5,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "PoppinsBold",
            fontSize: RFValue(17),
            color: "white",
          }}
        >
          Pick your exercises
        </Text>
        <Text
          style={{
            fontFamily: "PoppinsRegular",
            fontSize: RFValue(12),
            opacity: 0.5,
            color: "white",
          }}
        >
          Split {workoutSplitName}
        </Text>
      </View>

      <View style={{ flex: 9, marginBottom: height * 0.04 }}>
        <ChooseExercisesCard
          workoutSplitName={workoutSplitName}
          exercises={exercises}
          initialSelectedExercises={initialSelectedExercises}
          onSave={handleSaveExercises}
        />
      </View>
    </View>
  );
}

export default AddExercisesScreen;
