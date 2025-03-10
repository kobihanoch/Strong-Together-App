import React from "react";
import { View, FlatList } from "react-native";
import PickExerciseItem from "./PickExerciseItem";

const ExerciseList = ({ exercises }) => {
  return (
    <View style={{ flex: 7 }}>
      <FlatList
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PickExerciseItem exercise={item} />}
      />
    </View>
  );
};

export default ExerciseList;
