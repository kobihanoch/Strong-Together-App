import React, { useEffect, useMemo, useCallback } from "react";
import { View, FlatList } from "react-native";
import PickExerciseItem from "./PickExerciseItem";
import { useCreateWorkout } from "../../../context/CreateWorkoutContext";

const ExerciseList = () => {
  const { properties, utils } = useCreateWorkout();
  const { selectedExercises, focusedSplit, filteredExercises } = properties;

  // Compute selected split index safely (avoid crashes when not set yet)
  const selectedSplitIndexInArray = useMemo(() => {
    if (!selectedExercises?.length || !focusedSplit?.name) return -1;
    return selectedExercises.findIndex((s) => s.name === focusedSplit.name);
  }, [selectedExercises, focusedSplit]);

  // Reset to first muscle only on first mount (kept as in the original)
  useEffect(() => {
    utils.filterExercisesByFirstMuscle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stable key extractor (string)
  const keyExtractor = useCallback((item) => String(item.id), []);

  // Stable renderer — prevents re-renders of all rows when parent updates
  const renderItem = useCallback(
    ({ item }) => {
      const exercisesInCurrentSplit =
        selectedSplitIndexInArray >= 0
          ? selectedExercises[selectedSplitIndexInArray]?.exercises || []
          : [];

      return (
        <PickExerciseItem
          exercise={item}
          exercisesInCurrentSplit={exercisesInCurrentSplit}
        />
      );
    },
    [selectedSplitIndexInArray, selectedExercises]
  );

  return (
    <View style={{ flex: 7 }}>
      <FlatList
        data={filteredExercises || []}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        // Light, safe perf options (won't affect your styling)
        initialNumToRender={10}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
};

export default ExerciseList;
