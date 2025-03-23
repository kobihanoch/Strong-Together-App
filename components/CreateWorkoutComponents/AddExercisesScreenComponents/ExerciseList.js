import React from "react";
import { View, FlatList } from "react-native";
import PickExerciseItem from "./PickExerciseItem";

const ExerciseList = ({ exercises, onSelectExercise, selectedExercises }) => {
  return (
    <View style={{ flex: 7 }}>
      <FlatList
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PickExerciseItem
            exercise={item}
            onSelectExercise={onSelectExercise}
            isSelected={selectedExercises.some(
              (ex) => ex.id === item.id || ex.id === item.exercise_id
            )}
          />
        )}
      />
    </View>
  );
};

export default ExerciseList;
