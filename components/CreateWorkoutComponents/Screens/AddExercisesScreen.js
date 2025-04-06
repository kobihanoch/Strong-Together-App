import React from "react";
import { Dimensions, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import ChooseExercisesCard from "../AddExercisesScreenComponents/ChooseExercisesCard";

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

  console.log(
    "Selected exercise by split: " +
      JSON.stringify(selectedExercisesBySplit, null, 2)
  );

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
            fontFamily: "Inter_600SemiBold",
            fontSize: RFValue(20),
            color: "Black",
          }}
        >
          Pick your exercises
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: RFValue(15),
            opacity: 1,
            color: "rgb(97, 97, 97)",
          }}
        >
          Split {workoutSplitName}
        </Text>
      </View>

      <View style={{ flex: 9, marginBottom: height * 0.04 }}>
        <ChooseExercisesCard
          key={workoutSplitName}
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
