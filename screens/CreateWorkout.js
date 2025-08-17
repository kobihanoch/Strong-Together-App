// English comments only inside code

import React, { useCallback, useState } from "react";
import { Dimensions, View, Text, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  CreateWorkoutProvider,
  useCreateWorkout,
} from "../context/CreateWorkoutContext";
import SplitTabsRow from "../components/CreateWorkoutComponents/SplitTabsRow";
import SelectedExercisesList from "../components/CreateWorkoutComponents/SelectedExercisesList";
import ExercisePickerModal from "../components/CreateWorkoutComponents/ExercisePickerModal";

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

        {/* Action row: Add exercise + Save workout */}
        <View
          style={{
            paddingHorizontal: width * 0.04,
            marginBottom: height * 0.012,
            flexDirection: "row",
            gap: width * 0.03,
          }}
        >
          {/* Primary button (filled) */}
          <TouchableOpacity
            onPress={handleOpenExercisesTable}
            activeOpacity={0.9}
            style={{
              flex: 1,
              height: Math.max(48, height * 0.058),
              borderRadius: width * 0.035,
              backgroundColor: "#2979FF",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(14),
                color: "white",
                fontFamily: "Inter_700Bold",
              }}
            >
              Add exercise
            </Text>
          </TouchableOpacity>

          {/* Secondary button (outline -> becomes filled when saving) */}
          <TouchableOpacity
            onPress={handleSaveWorkout}
            activeOpacity={0.9}
            disabled={properties?.isSaving}
            style={{
              paddingHorizontal: width * 0.04,
              height: Math.max(48, height * 0.058),
              borderRadius: width * 0.035,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 3,
              borderWidth: 2,
              borderColor: properties?.isSaving ? "#A8C5FF" : "#2979FF",
              backgroundColor: properties?.isSaving ? "#EAF0F6" : "white",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(14),
                color: properties?.isSaving ? "#6B7A90" : "#2979FF",
                fontFamily: "Inter_700Bold",
              }}
            >
              {properties?.isSaving ? "Saving..." : "Save workout"}
            </Text>
          </TouchableOpacity>
        </View>

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
