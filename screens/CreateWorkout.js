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
  // Flags from context
  const { properties } = useCreateWorkout();

  // Local state to control modal visibility
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleOpenExercisesTable = useCallback(() => setIsPickerOpen(true), []);
  const handleClosePicker = useCallback(() => setIsPickerOpen(false), []);

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: height * 0.02,
        backgroundColor: "transparent",
      }}
    >
      {properties?.hasWorkout ? (
        <View style={{ flex: 1, alignItems: "stretch" }}>
          <SplitTabsRow />

          {/* Add exercise button */}
          <View
            style={{
              paddingHorizontal: width * 0.04,
              marginBottom: height * 0.012,
            }}
          >
            <TouchableOpacity
              onPress={handleOpenExercisesTable}
              activeOpacity={0.9}
              style={{
                height: Math.max(46, height * 0.055),
                borderRadius: width * 0.03,
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
          </View>

          <SelectedExercisesList />

          {/* Sliding bottom-sheet modal */}
          <ExercisePickerModal
            visible={isPickerOpen}
            onClose={handleClosePicker}
          />
        </View>
      ) : (
        <View>
          <Text>Doesn't have workout</Text>
        </View>
      )}
    </View>
  );
};

export default CreateWorkout;
