import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import MuscleTabs from "./MuscleTabs";
import ExerciseList from "./ExerciseList";

const { width, height } = Dimensions.get("window");

function ChooseExercisesCard({ workoutSplitName, exercises }) {
  const [groupedExercises, setGroupedExercises] = useState({});
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);

  // Group exercises by muscle group
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
      <ExerciseList exercises={groupedExercises[selectedMuscleGroup] || []} />
    </LinearGradient>
  );
}

export default ChooseExercisesCard;
