import React, { useCallback, useMemo, useState, useRef } from "react";
import { Dimensions, View } from "react-native";
import {
  CreateWorkoutProvider,
  useCreateWorkout,
} from "../context/CreateWorkoutContext";
import SplitTabsRow from "../components/CreateWorkoutComponents/SplitTabsRow";
import SelectedExercisesList from "../components/CreateWorkoutComponents/SelectedExercisesList";
import ExercisePickerModal from "../components/CreateWorkoutComponents/ExercisePickerModal";
import ActionButtons from "../components/CreateWorkoutComponents/ActionButtons";

const { width, height } = Dimensions.get("window");

function CreateWorkout({ navigation }) {
  return (
    <CreateWorkoutProvider>
      <InnerCreateWorkout />
    </CreateWorkoutProvider>
  );
}

const InnerCreateWorkout = () => {
  // Pull flags and actions from context
  const { properties, editing, actions } = useCreateWorkout();

  const pickerRef = useRef(null);
  const openPicker = useCallback(() => {
    pickerRef.current?.open?.(1);
  }, [pickerRef]);

  // Save handler (uses context action if available)
  const handleSaveWorkout = useCallback(() => {
    actions.saveWorkout();
  }, [actions, editing?.selectedExercises]);

  const invalidWorkout = useMemo(() => {
    const map = editing?.selectedExercises || {};
    const keys = Object.keys(map);
    if (keys.length === 0) return true;
    return keys.some((k) => (map[k]?.length ?? 0) === 0);
  }, [editing?.selectedExercises]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: height * 0.1,
        paddingBottom: height * 0.0,
        backgroundColor: "transparent",
      }}
    >
      <View style={{ flex: 1, alignItems: "stretch" }}>
        <SplitTabsRow />

        {/* New action bar */}
        <ActionButtons
          onAdd={openPicker}
          onSave={handleSaveWorkout}
          saving={properties?.isSaving}
          // optional: disable the save button if invalid
          disableSave={invalidWorkout}
        />

        <SelectedExercisesList />

        {/* Sliding bottom-sheet modal */}
        <ExercisePickerModal ref={pickerRef} />
      </View>
    </View>
  );
};

export default CreateWorkout;
