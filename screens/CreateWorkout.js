import React, { useCallback, useMemo, useRef } from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import ExercisePickerModal from "../components/CreateWorkoutComponents/ExercisePickerModal";
import useCreateWorkoutLogic from "../hooks/logic/useCreateWorkoutLogic";
import TopSection from "../components/CreateWorkoutComponents/TopSection";

const { width, height } = Dimensions.get("window");

const CreateWorkout = () => {
  // Pull flags and actions from context
  const {
    selectedExercises = { A: [] },
    splitsList = [],
    availableExercises = [],
    saveWorkout,
    controls = {},
    loadings = {},
    hasWorkout = false,
    setSelectedSplit,
    selectedSplit = "A",
    exerciseCountMap = { A: 0 },
    totalExercises = 0,
  } = useCreateWorkoutLogic() || {};

  const pickerRef = useRef(null);
  const openPicker = useCallback(() => {
    pickerRef.current?.open?.(1);
  }, [pickerRef]);

  return (
    <View style={styles.container}>
      <TopSection
        hasWorkout={hasWorkout}
        splitsList={splitsList}
        setSelectedSplit={setSelectedSplit}
        selectedSplit={selectedSplit}
        exerciseCountMap={exerciseCountMap}
        totalExercises={totalExercises}
        addSplit={controls.addSplit}
        removeSplit={controls.removeSplit}
      />
      {/*<SplitTabsRow />

        {/* New action bar
        <ActionButtons
          onAdd={openPicker}
          onSave={handleSaveWorkout}
          saving={properties?.isSaving}
          // optional: disable the save button if invalid
          disableSave={invalidWorkout}
        />

        <SelectedExercisesList />*/}

      {/* Sliding bottom-sheet modal */}
      <ExercisePickerModal ref={pickerRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CreateWorkout;
