// English comments only inside code

import React, { useCallback, useState } from "react";
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

  // Local state to control modal visibility
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleOpenExercisesTable = useCallback(() => setIsPickerOpen(true), []);
  const handleClosePicker = useCallback(() => setIsPickerOpen(false), []);

  // Save handler (uses context action if available)
  const handleSaveWorkout = useCallback(() => {
    if (actions?.saveWorkout) {
      actions.saveWorkout(editing?.selectedExercises);
      return;
    }
    console.warn("saveWorkout action is not implemented in context.");
  }, [actions, editing?.selectedExercises]);

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: height * 0.02,
        backgroundColor: "transparent",
      }}
    >
      <View style={{ flex: 1, alignItems: "stretch" }}>
        <SplitTabsRow />

        {/* New action bar */}
        <ActionButtons
          onAdd={handleOpenExercisesTable}
          onSave={handleSaveWorkout}
          saving={properties?.isSaving}
        />

        <SelectedExercisesList />

        {/* Sliding bottom-sheet modal */}
        <ExercisePickerModal
          visible={isPickerOpen}
          onClose={handleClosePicker}
        />
      </View>
    </View>
  );
};

export default CreateWorkout;
