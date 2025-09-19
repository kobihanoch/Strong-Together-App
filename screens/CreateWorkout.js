import React, { useCallback, useMemo, useRef } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ExercisePickerModal from "../components/CreateWorkoutComponents/ExercisePickerModal";
import useCreateWorkoutLogic from "../hooks/logic/useCreateWorkoutLogic";
import TopSection from "../components/CreateWorkoutComponents/TopSection";
import { colors } from "../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import SelectedExercisesList from "../components/CreateWorkoutComponents/SelectedExercisesList";

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
    exForSplit,
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
      <SelectedExercisesList exForSplit={exForSplit} controls={controls} />

      {/* Sliding bottom-sheet modal */}
      <TouchableOpacity
        style={styles.openExercisesModalBtn}
        onPress={openPicker}
      >
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
      <ExercisePickerModal
        ref={pickerRef}
        selectedSplit={selectedSplit}
        controls={controls}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  openExercisesModalBtn: {
    backgroundColor: colors.primary,
    height: 60,
    aspectRatio: 1,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    // Android shadow
    elevation: 6,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  plusText: {
    color: "white",
    fontSize: RFValue(25),
  },
});

export default CreateWorkout;
