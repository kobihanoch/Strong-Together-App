import React, { useEffect } from "react";
import { View, FlatList } from "react-native";
import PickExerciseItem from "./PickExerciseItem";
import { useCreateWorkout } from "../../../context/CreateWorkoutContext";

const ExerciseList = () => {
  const { properties, utils } = useCreateWorkout();
  const selectedSplitIndexInArray = properties.selectedExercises.findIndex(
    (split) => split.name === properties.focusedSplit.name
  );

  // Reset to first muscle every time loading flatlist
  useEffect(() => {
    utils.filterExercisesByFirstMuscle();
  }, []);

  return (
    <View style={{ flex: 7 }}>
      <FlatList
        data={properties.filteredExercises}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PickExerciseItem
            exercise={item}
            exercisesInCurrentSplit={
              properties.selectedExercises[selectedSplitIndexInArray].exercises
            }
          />
        )}
      />
    </View>
  );
};

export default ExerciseList;
