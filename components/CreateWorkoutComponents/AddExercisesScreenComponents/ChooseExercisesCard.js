import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import MuscleTabs from "./MuscleTabs";
import ExerciseList from "./ExerciseList";

const { width, height } = Dimensions.get("window");

function ChooseExercisesCard({
  workoutSplitName,
  exercises,
  initialSelectedExercises = [],
  onSave,
}) {
  const [groupedExercises, setGroupedExercises] = useState({});
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState();

  useEffect(() => {
    setSelectedExercises(initialSelectedExercises || []);
  }, [initialSelectedExercises, workoutSplitName]);

  useEffect(() => {
    const grouped = exercises.reduce((acc, exercise) => {
      const muscleGroup = exercise.targetmuscle || "Other";
      if (!acc[muscleGroup]) acc[muscleGroup] = [];
      acc[muscleGroup].push(exercise);
      return acc;
    }, {});

    setGroupedExercises(grouped);
    setSelectedMuscleGroup(Object.keys(grouped)[0]);
  }, [exercises]);

  const toggleExerciseSelection = (exercise) => {
    setSelectedExercises((prevSelected) => {
      const existingExercise = prevSelected.find((ex) => ex.id === exercise.id);

      if (existingExercise) {
        return prevSelected.filter((ex) => ex.id !== exercise.id);
      }

      return [
        ...prevSelected,
        { ...exercise, sets: exercise.sets || ["10", "10", "10"] },
      ];
    });
  };

  return (
    <LinearGradient
      colors={["rgb(255, 255, 255)", "rgb(255, 255, 255)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        flexDirection: "column",
        borderRadius: width * 0.09,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
      }}
    >
      {/* Header and tabs */}
      <View style={{ flexDirection: "column", flex: 3 }}>
        <Text
          style={{
            fontFamily: "PoppinsBold",
            fontSize: RFValue(16),
            color: "#0d2540",
            textAlign: "center",
            marginBottom: height * 0.02,
          }}
        >
          {workoutSplitName} Exercises
        </Text>

        {/* Tabs */}
        <MuscleTabs
          muscleGroups={Object.keys(groupedExercises)}
          selectedMuscleGroup={selectedMuscleGroup}
          onSelectMuscle={setSelectedMuscleGroup}
        />
      </View>

      {/* List of grouped exercises*/}
      <ExerciseList
        exercises={groupedExercises[selectedMuscleGroup] || []}
        onSelectExercise={toggleExerciseSelection}
        selectedExercises={selectedExercises}
      />

      <TouchableOpacity
        onPress={() => onSave(workoutSplitName, selectedExercises)}
        style={{
          backgroundColor: "#0d2540",
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Save Exercises</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

export default ChooseExercisesCard;
