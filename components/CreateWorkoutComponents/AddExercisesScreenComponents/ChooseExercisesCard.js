import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import ExerciseList from "./ExerciseList";
import MuscleTabs from "./MuscleTabs";

const { width, height } = Dimensions.get("window");

function ChooseExercisesCard({
  workoutSplitName,
  exercises,
  initialSelectedExercises = [],
  onSave,
}) {
  const [groupedExercises, setGroupedExercises] = useState({});
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const normalizeExercise = (exercise) => ({
    id: exercise.exercise_id || exercise.id,
    name: exercise.name || exercise.exercise || "Unnamed Exercise",
    sets: Array.isArray(exercise.sets)
      ? exercise.sets.map((s) => s.toString())
      : ["10", "10", "10"],
    targetmuscle: exercise.targetmuscle || null,
    specifictargetmuscle: exercise.specifictargetmuscle || null,
  });

  useEffect(() => {
    const normalized = initialSelectedExercises.map(normalizeExercise);
    setSelectedExercises(normalized);
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
    const normalized = normalizeExercise(exercise);
    setSelectedExercises((prevSelected) => {
      const exists = prevSelected.some((ex) => ex.id === normalized.id);
      if (exists) {
        return prevSelected.filter((ex) => ex.id !== normalized.id);
      }
      return [...prevSelected, normalized];
    });
  };

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
          {workoutSplitName} Exercises
        </Text>

        <MuscleTabs
          muscleGroups={Object.keys(groupedExercises)}
          selectedMuscleGroup={selectedMuscleGroup}
          onSelectMuscle={setSelectedMuscleGroup}
        />
      </View>

      <ExerciseList
        exercises={groupedExercises[selectedMuscleGroup] || []}
        onSelectExercise={toggleExerciseSelection}
        selectedExercises={selectedExercises}
      />

      <TouchableOpacity
        onPress={() => onSave(workoutSplitName, selectedExercises)}
        style={{
          backgroundColor: "#2979FF",
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Save Exercises</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ChooseExercisesCard;
